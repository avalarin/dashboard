import DataClient from 'lib/dataClient';
import UafClient from 'lib/uafClient';
import utils from 'lib/utils';

try {

class UG2000Client extends UafClient {
  constructor(dataClient, appId) {
    super(dataClient);
    this.appId = appId;

    this.fireControl = document.getElementById('fireControl');
    this.angleControl = document.getElementById('angleControl');
  }

  begin() {
    this.connectToApp(this.appId);
  }

  onApplicationConnected() {
    console.log('Application connected');

    this.fireControl.addEventListener("touchstart", (event) => {
      event.preventDefault();
      this.fireControl.style.background = 'red';
      this.sendToApp({ command: 'startShoting' });
    });

    this.fireControl.addEventListener("touchend", (event) => {
      event.preventDefault();
      this.fireControl.style.background = 'green';
      this.sendToApp({ command: 'stopShoting' });
    });

    this.angleControl.addEventListener("touchstart", (event) => {
      event.preventDefault();
      this.angleControl.style.background = 'yellow';
      this.angleTouch = event.changedTouches[0].identifier;
    });

    this.angleControl.addEventListener("touchend", (event) => {
      event.preventDefault();
      this.angleControl.style.background = 'blue';
      this.angleTouch = null;
    });

    this.angleControl.addEventListener("touchmove", (event) => {
      try {
        event.preventDefault();
        var content = 'touchmove ' + event.touches.length + '<br/>';
        var t = this.getAngleTouch(event);
        var rect = this.angleControl.getBoundingClientRect();
        var maxX = rect.width - 20;
        var x = t.pageX - rect.left + 10;
        var p = x / maxX;
        p = Math.max(0, Math.min(p, 1)) - 0.5;
        var a = 2.6 * p;

        content += 'p:' + (p * 100) + '%<br/>';
        content += 'a:' + a + '<br/>';

        this.sendToApp({ command: 'setAngle', angle: a });
        this.angleControl.innerHTML = content;
      } catch (e) {
        alert(e);
      }
    });
  }

  getAngleTouch(event) {
      for (var i = 0; i < event.touches.length; i++) {
        var t = event.touches[i];
        if (t.identifier == this.angleTouch) {
          return t;
        }
      }
      return null;
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
