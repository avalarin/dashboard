class UafClient {
  constructor(dataClient, options) {
    options = options || {};

    if (!options.appId) {
      throw Error("[appId] is required");
    }

    this.appId = options.appId;
    this.dataClient = dataClient;
  }

  connectToApp() {
    this.dataClient.send("uaf.connectToApp", { appId: this.appId }, response => {
      if (response.success) {
        this.onApplicationRegistred();

        this.dataClient.subscribe("uaf.message", message => {
          this.onApplicationMessage(message.data);
        });
      }
    });
  }
  
  onApplicationConnected() { }

  onApplicationMessage(data) {  }

  sendToApp(data) {
    this.dataClient.send("uaf.messageToApp", { appId: clientId, data: data  });
  }
}

export default UafClient;
