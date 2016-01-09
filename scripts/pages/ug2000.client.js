import DataClient from 'lib/dataClient';
import UafClient from 'lib/uafClient';
import utils from 'lib/utils';

try {

class UG2000Client extends UafClient {
  constructor(dataClient, appId) {
    super(dataClient);
    this.appId = appId;
  }

  begin() {
    this.connectToApp(this.appId);
  }

  onApplicationConnected() {
    console.log('Application connected');

    document.addEventListener("touchstart", () => {
      this.sendToApp({ command: 'startShoting' });
    });

    document.addEventListener("touchend", () => {
      this.sendToApp({ command: 'stopShoting' });
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

var client = new UG2000Client(client, qs.appId);
client.begin();

}
catch(err) {
  alert(err.toString());
}
