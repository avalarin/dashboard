import paper from 'paper';
import DataClient from 'lib/dataClient';
import toastr from 'toastr';
import UafApp from 'lib/uafApp';
import Game from 'ext/ug2000/game';

class UG2000App extends UafApp {
  constructor(dataClient, options) {
    super(dataClient, options);
  }

  begin() {
    this.registerApp('UG2000App', 'ug2000.client.html');
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
  }
}

var client = new DataClient();
DataClient.default = client;

var app = new UG2000App(client);
app.begin();

var game = new Game();
game.begin(() => {
  //Для перевода в локальные координаты
  var locToGlobRect = Path.Rectangle(0, 0, game.width, game.height);
  locToGlobRect.transformContent = false;
  locToGlobRect.position = view.center;

  view.onMouseMove = function(event) {
	  var point = locToGlobRect.globalToLocal(event.point);
	  game.setTargetPosition(point.x, point.y);
  };

  view.onMouseDown = function(event) {
	  game.startShoting();
  };

  view.onMouseUp = function(event) {
	  game.stopShoting();
  };
});
