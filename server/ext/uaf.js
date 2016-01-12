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
        context.dataGate.sendResponse(message, sender, { error: err.toString() });
        console.log(err);
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
      context: sender,
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
      console.error('Application ' + message.appId + ' not found');
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
      console.error('Client not registred');
      throw "clientNotRegistred";
    }

    var app = apps[client.app.id];
    if (!app) {
      console.error('Application ' + client.app.id + ' not found');
      context.dataGate.sendResponse(message, sender, { error: "appNotFound" });
      return;
    }

    context.dataGate.send("uaf.message", app.context, { remoteClientId: client.id, data: message.data });
  }

  function messageToClient(sender, message) {
    var app = apps[sender.id];

    if (!app) {
      console.error('Application not registred');
      throw "appNotRegistred";
    }

    var client = app.clients[message.remoteClientId];

    if (!client) {
      console.error('Client ' + message.remoteClientId + ' not found');
      throw "clientNotFound";
    }

    context.dataGate.send("uaf.message", client.context, { appId: app.id, data: message.data });
  }

  function reloadApp(sender, message) {
    var app = apps[sender.id];

    if (!app) {
      console.error('Application not registred');
      throw "appNotRegistred";
    }

    var code = randomstring.generate(16);

    console.log('Reload code ' + code + ' created for ' + app.id);

    var clientsToRestore = { };
    Object.keys(app.clients).forEach(function(id) {
      clientsToRestore[id] = app.clients[id];
    });

    reloadCodes[code] = {
      code: code,
      oldId: app.id,
      oldApp: app,
      clients: clientsToRestore
    };
    context.dataGate.sendResponse(message, sender, { reloadCode: code });
  }

  function restoreClients(sender, message) {
    var code = reloadCodes[message.reloadCode];
    if (!code) {
      console.error('Reload code ' + code + '  not found');
      throw "cannotReload";
    }

    Object.keys(code.clients).forEach(function(id) {
      var client = code.clients[id];
      context.dataGate.send('uaf.newAppId', client.context, { oldAppId: code.oldId, newAppId: sender.id });
    });

    delete reloadCodes[code]
  }

  function disconnectApp(id) {
    var app = apps[id];

    if (!app) {
      // Already disconnected
      return;
    }

    Object.keys(app.clients).forEach(function(clientId) {
      var client = app.clients[clientId];
      context.dataGate.send("uaf.appDisconnected", client.context, { appId: app.id });
      delete clients[clientId];
    });

    delete apps[id];

    console.log('Application ' + id + " disconnected");
  }

  function disconnectClient(id) {
    var client = clients[id];

    if (!client) {
      // Already disconnected
      return;
    }

    context.dataGate.send("uaf.clientDisconnected", client.app.context, { appId: client.app.id, remoteClientId: client.id });

    delete client.app.clients[id];
    delete clients[id];
    console.log('Client ' + id + " disconnected");
  }
};
