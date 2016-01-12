class UafApp {
  constructor(dataClient, options) {
    this.dataClient = dataClient;
  }

  registerApp(name, clientPage) {
    var options = {
      name: name,
      clientPage: clientPage
    };
    this.dataClient.send("uaf.registerApp", options, response => {
      if (response.success) {
        this.onApplicationRegistred();

        this.dataClient.subscribe("uaf.message", message => {
          this.onClientMessage(message.remoteClientId, message.data);
        });
        this.dataClient.subscribe("uaf.clientConnected", message => {
          this.onClientConnected(message.remoteClientId);
        });
        this.dataClient.subscribe("uaf.clientDisconnected", message => {
          this.onClientDisconnected(message.remoteClientId);
        });
      }
    });
  }

  onApplicationRegistred() { }

  onClientConnected(clientId) { }

  onClientDisconnected(clientId) { }

  onClientMessage(clientId, data) {  }

  requestReloadCode(callback) {
    this.dataClient.send('uaf.reloadApp', { }, (message) => {
      var reloadCode = message.reloadCode;
      callback(reloadCode);
    });
  }

  restoreClients(reloadCode) {
    this.dataClient.send('uaf.restoreClients', { reloadCode: reloadCode });
  }

  sendToClient(clientId, data) {
    this.dataClient.send("uaf.messageToClient", { remoteClientId: clientId, data: data  });
  }
}

export default UafApp;
