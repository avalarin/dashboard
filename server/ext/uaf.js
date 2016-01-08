// uaf - ultra apps framework
module.exports = function(context) {
  var apps = {};
  var clients = {};

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

    res.redirect("/" + app.clientPage + "?appid=" + appId);
  });


  context.registerHandler("uaf.registerApp", catchExceptions(registerApp));

  context.registerHandler("uaf.connectToApp", catchExceptions(connectToApp));

  context.registerHandler("uaf.messageToApp", catchExceptions(messageToApp));

  context.registerHandler("uaf.messageToClient", catchExceptions(messageToClient));

  function catchExceptions(func) {
    return function(client, message) {
      try {
        func(client, message);
      } catch(err) {
        console.error(err);
        context.dataGate.sendResponse(message, client, { error: err.toString() });
      }
    }
  }

  function registerApp(client, message) {
    if (apps[client.id]) {
      console.error('Only one application per socket allowed');
      throw "cannotRegister";
    }

    var app = {
      id: client.id,
      name: message.name,
      clientPage: message.clientPage,
      context: client,
      clients: { }
    };

    apps[client.id] = app;

    console.log('Client ' + client.id + " created the " + message.name + "app");
    context.dataGate.sendResponse(message, client, { success: true });
  }

  function connectToApp(client, message) {
    if (clients[client.id]) {
      console.error('Only one apllication client per socket allowed');
      throw "cannotConnect";
    }

    var app = apps[message.appId];
    if (!app) {
      console.error('Application ' + message.appId + ' is not found');
      throw "appNotFound";
    }

    var uafClient = {
      context: client,
      appId: app.id,
      clientId: client.id
    }

    app.clients[client.id] = uafClient;
    clients[client.id] = uafClient;
    app.connected = true;

    console.log('Client ' + client.id + ' connected to the app ' + app.name + ' ' + app.id);

    context.dataGate.send("uaf.clientConnected", app.context, { remoteClientId: client.id });
    context.dataGate.sendResponse(message, client, { success: true });
  }

  function messageToApp(client, message) {
    var uafClient = clients[client.id];

    if (!uafClient) {
      console.error('Client is not registred');
      throw "clientNotRegistred";
    }

    var app = apps[uafClient.appId];
    if (!app) {
      console.error('Application ' + uafClient.appId + ' is not found');
      context.dataGate.sendResponse(message, client, { error: "appNotFound" });
      return;
    }

    context.dataGate.send("uaf.message", app.context, { remoteClientId: client.id, data: message.data });
  }

  function messageToClient(client, message) {
    var app = apps[client.id];

    if (!app) {
      console.error('Application is not registred');
      throw "appNotRegistred";
    }

    var uafClient = app.clients[message.remoteClientId];

    if (!uafClient) {
      console.error('Client ' + message.remoteClientId + ' is not found');
      throw "clientNotFound";
    }

    context.dataGate.send("uaf.message", uafClient.context, { appId: client.id, data: message.data });
  }
};
