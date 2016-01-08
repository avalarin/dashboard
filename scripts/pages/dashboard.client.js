import DataClient from 'lib/dataClient';
import UafClient from 'lib/uafClient';
import utils from 'lib/utils';

class DashboardClient extends UafClient {
  constructor(dataClient, appId) {
    super(dataClient);
    this.appId = appId;
  }

  begin() {
    this.connectToApp(this.appId);
  }

  onApplicationConnected() {
    console.log('Application connected');

    document.getElementById('test').addEventListener("click", () => {
      this.sendToApp('test');
    });
  }

  onApplicationMessage(data) {
    console.log('Message from application: ' + data);
  }
}

var client = new DataClient('ws://localhost:3000');
DataClient.default = client;

var qs = utils.parseQueryString();
if (!qs.appId) {
  throw "[appId] quesry string parameter is required";
}

var client = new DashboardClient(client, qs.appId);
client.begin();
