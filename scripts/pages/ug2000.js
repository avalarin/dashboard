import paper from 'paper';
import DataClient from 'lib/dataClient';
import toastr from 'toastr';
import UafApp from 'lib/uafApp';
import Game from 'ext/ug2000/game';
import utils from 'lib/utils';

class UG2000App extends UafApp {
  constructor(dataClient, options) {
    super(dataClient, options);
    this.game = new Game();
  }

  begin() {
    this.game.begin(() => {
      this.onGameInitialized();
    });
  }

  onGameInitialized() {
    this.registerApp('UG2000App', 'ug2000.client.html');

    //Для перевода в локальные координаты
    var locToGlobRect = Path.Rectangle(0, 0, this.game.width, this.game.height);
    locToGlobRect.transformContent = false;
    locToGlobRect.position = view.center;

    view.onMouseMove = event => {
  	  var point = locToGlobRect.globalToLocal(event.point);
  	  this.game.setTargetPosition(point.x, point.y);
    };

    view.onMouseDown = event => {
  	  this.game.startShoting();
    };

    view.onMouseUp = event => {
  	  this.game.stopShoting();
    };
  }

  onApplicationRegistred() {
    console.log('Application registred');
  }

  onClientConnected(clientId) {
    console.log('Client ' + clientId + ' connected');
    toastr.info('Client ' + clientId + ' connected', 'System');
  }

  onClientMessage(clientId, data) {
    console.log('Message from ' + clientId, data);
    if (data.command == 'startShoting') {
      this.game.startShoting();
    } else if (data.command == 'stopShoting') {
      this.game.stopShoting();
    }
  }
}

var client = new DataClient();
DataClient.default = client;

var app = new UG2000App(client);
app.begin();

var qs = utils.parseQueryString();
if (qs.reloadCode) {
  app.restoreClients(qs.reloadCode);
}
