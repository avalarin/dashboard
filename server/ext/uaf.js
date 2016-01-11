// uaf - ultra apps framework
var randomstring = require("randomstring");

module.exports = function(context) {
  var apps = {};
  var clients = {};
  var reloadCodes = {};

  context.express.get("/connect/:appId", function (req, res) {
    var appId = req.params.appId;
    var app = apps[appId];
    if (!app) {
      res.send("Application not found");
      return;
    }

    if (!app.clientPage) {
      res.send("Application found: " + app.name);
      return;
    }

    res.redirect("/" + app.clientPage + "?appId=" + appId);
  });


  context.registerHandler("uaf.registerApp", catchExceptions(registerApp));

  context.registerHandler("uaf.connectToApp", catchExceptions(connectToApp));

  context.registerHandler("uaf.messageToApp", catchExceptions(messageToApp));

  context.registerHandler("uaf.messageToClient", catchExceptions(messageToClient));

  context.registerHandler("uaf.reloadApp", catchExceptions(reloadApp));

  context.registerHandler("uaf.restoreClients", catchExceptions(restoreClients));

  function catchExceptions(func) {
    return function(sender, message) {
      try {
        func(sender, message);
      } catch(err) {
        console.error(err);
        context.dataGate.sendResponse(message, sender, { error: err.toString() });
      }
    }
  }

  function registerApp(sender, message) {
    if (apps[sender.id]) {
      console.error('Only one application per socket allowed');
      throw "cannotRegister";
    }

    var app = {
      id: sender.id,
      name: message.name,
      clientPage: message.clientPage,
      sender: sender,
      clients: { }
    };

    sender.on('disconnected', function() {
      disconnectApp(app.id);
    });

    apps[app.id] = app;

    console.log('Client ' + app.id + " created the " + message.name + " app");
    context.dataGate.sendResponse(message, sender, { success: true });
  }

  function connectToApp(sender, message) {
    if (clients[sender.id]) {
      console.error('Only one apllication sender per socket allowed');
      throw "cannotConnect";
    }

    var app = apps[message.appId];
    if (!app) {
      console.error('Application ' + message.appId + ' is not found');
      throw "appNotFound";
    }

    var client = {
      id: sender.id,
      context: sender,
      app: app
    }

    sender.on('disconnected', function() {
      disconnectClient(client.id);
    });

    app.clients[client.id] = client;
    clients[client.id] = client;
    app.connected = true;

    console.log('Client ' + client.id + ' connected to the app ' + app.name + ' ' + app.id);

    context.dataGate.send("uaf.clientConnected", app.context, { remoteClientId: client.id });
    context.dataGate.sendResponse(message, sender, { success: true });
  }

  function messageToApp(sender, message) {
    var client = clients[sender.id];

    if (!client) {
      console.error('Client is not registred');
      throw "clientNotRegistred";
    }

    var app = apps[client.app.id];
    if (!app) {
      console.error('Application ' + client.app.id + ' is not found');
      context.dataGate.sendResponse(message, sender, { error: "appNotFound" });
      return;
    }

    context.dataGate.send("uaf.message", app.context, { remoteClientId: client.id, data: message.data });
  }

  function messageToClient(sender, message) {
    var app = apps[sender.id];

    if (!app) {
      console.error('Application is not registred');
      throw "appNotRegistred";
    }

    var client = app.clients[message.remoteClientId];

    if (!client) {
      console.error('Client ' + message.remoteClientId + ' is not found');
      throw "clientNotFound";
    }

    context.dataGate.send("uaf.message", client.context, { appId: app.id, data: message.data });
  }

  function reloadApp(sender, message) {
    var app = apps[sender.id];

    if (!app) {
      console.error('Application is not registred');
      throw "appNotRegistred";
    }

    var code = randomstring.generate(16);

    console.log('Reload code ' + code + ' created for ' + app.id);

    reloadCodes[code] = sender;
    context.dataGate.sendResponse(message, sender, { reloadCode: code });
  }

  function restoreClients(sender, message) {
    var code = message.reloadCode;
    var oldClient = reloadCodes[code];
    if (!oldClient) {
      console.error('Reload code ' + code + ' is not found');
      throw "cannotReload";
    }

    var clients = apps[oldClient.id].clients;
    for (var clientId in clients) {
      if (!clients.hasOwnProperty(clientId)) continue;
      var client = clients[clientId].context;
      context.dataGate.send('uaf.newAppId', client, { oldAppId: oldClient.id, newAppId: sender.id });
    }

    delete reloadCodes[code]
  }

  function disconnectApp(id) {
    var app = apps[id];

    if (!app) {
      console.error('Application is not registred');
      throw "appNotRegistred";
    }

    Object.keys(app.clients).forEach(function(clientId) {
      var client = app.clients[clientId];
      context.dataGate.send("uaf.disconnected", client.context, { appId: app.id });
      delete clients[clientId];
    });

    context.dataGate.send("uaf.disconnected", app.context, { appId: app.id });
    delete apps[id];

    console.log('Application ' + id + " disconnected");
  }

  function disconnectClient(id) {
    var client = clients[id];

    if (!client) {
      console.error('Client is not registred');
      throw "clientNotRegistred";
    }

    context.dataGate.send("uaf.disconnected", client.context, { appId: app.id });
    context.dataGate.send("uaf.disconnected", client.app.context, { appId: app.id, clientId: client.id });

    delete client.app.clients[id];
    delete clients[id];

    console.log('Client ' + id + " disconnected");
  }
};
