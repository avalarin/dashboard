class UafClient {
  constructor(dataClient, options) {
    this.dataClient = dataClient;
  }

  connectToApp(appId) {
    this.dataClient.send("uaf.connectToApp", { appId: appId }, response => {
      if (response.success) {
        this.onApplicationConnected();

        this.dataClient.subscribe("uaf.message", message => {
          this.onApplicationMessage(message.data);
        });
      }
    });
  }

  onApplicationConnected() { }

  onApplicationMessage(data) {  }

  sendToApp(data) {
    this.dataClient.send("uaf.messageToApp", { data: data });
  }
}

export default UafClient;
