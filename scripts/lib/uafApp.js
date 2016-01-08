class UafApp {
  constructor(dataClient, options) {
    this.dataClient = dataClient;
  }

  registerApp(name) {
    this.dataClient.send("uaf.registerApp", { name: name }, response => {
      if (response.success) {
        this.onApplicationRegistred();

        this.dataClient.subscribe("uaf.message", message => {
          this.onClientMessage(message.remoteClientId, message.data);
        });
        this.dataClient.subscribe("uaf.clientConnected", message => {
          this.onClientConnected(message.remoteClientId);
        });
      }
    });
  }

  onApplicationRegistred() { }

  onClientConnected(clientId) { }

  onClientMessage(clientId, data) {  }

  sendToClient(clientId, data) {
    this.dataClient.send("uaf.messageToClient", { remoteClientId: clientId, data: data  });
  }
}

export default UafApp;
