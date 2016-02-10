import UafApp from 'lib/uafApp';
import Builder from 'ext/dashboard/builder';
import toastr from 'toastr';

import TilesGridWidget from 'widgets/tilesGrid';

class DashboardApp extends UafApp {
  constructor(dataClient, options) {
    super(dataClient, options);

    this.element = document.getElementById('container');
  }

  begin() {
    this.registerApp('Dashboard', 'dashboard.client.html');
  }

  onApplicationRegistred() {
    console.log('Application registred');

    this.dataClient.subscribe("config.dashboard", message => {
      this.onConfigChanged(message.data);
    });
    this.dataClient.send('server.get', { tkey: 'config.dashboard' });
  }

  onClientConnected(clientId) {
    console.log('Client ' + clientId + ' connected');
    toastr.info('Client ' + clientId + ' connected', 'System');
  }

  onClientDisconnected(clientId) {
    console.log('Client ' + clientId + ' disconnected');
    toastr.info('Client ' + clientId + ' disconnected', 'System');
  }

  onConfigChanged(config) {
    var config = config.pages[0].tiles;
    Builder.buildWidgets(config, this.element);
  }

  onClientMessage(clientId, data) {
    console.log('Message from ' + clientId, data);
    if (data.command == 'showToast') {
      toastr.info(data.message, 'Message');
    } else if (data.command == 'showStatic') {
      this.dataClient.local('page.staticMessage', { data: data.message });
    } else if (data.command == 'reloadPage') {
      this.requestReloadCode(reloadCode => {
        var newLocation = location.origin + location.pathname + '?reloadCode=' + reloadCode;
        location.href = newLocation;
      });
    } else if (data.command == 'goPage') {
      this.requestReloadCode(reloadCode => {
        var newLocation = location.origin + '/' + data.url + '?reloadCode=' + reloadCode;
        location.href = newLocation;
      });
    }
  }
}

export default DashboardApp;
