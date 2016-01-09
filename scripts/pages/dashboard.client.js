import DataClient from 'lib/dataClient';
import UafClient from 'lib/uafClient';
import utils from 'lib/utils';

try {

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

    document.getElementById('sendToast').addEventListener("click", () => {
      var message = document.getElementById('message').value;
      this.sendToApp({ command: 'showToast', message: message });
    });

    document.getElementById('sendStatic').addEventListener("click", () => {
      var message = document.getElementById('message').value;
      this.sendToApp({ command: 'showStatic', message: message });
    });

    document.getElementById('reload').addEventListener("click", () => {
      this.sendToApp({ command: 'reloadPage' });
    });

    document.getElementById('goUg2000').addEventListener("click", () => {
      this.sendToApp({ command: 'goPage', url: 'ug2000.html' });
    });
  }

  onApplicationMessage(data) {
    console.log('Message from application: ' + data);
  }
}

var client = new DataClient();
DataClient.default = client;

var qs = utils.parseQueryString();
if (!qs.appId) {
  throw "[appId] query string parameter is required";
}

var client = new DashboardClient(client, qs.appId);
client.begin();

}
catch(err) {
  alert(err.toString());
}
