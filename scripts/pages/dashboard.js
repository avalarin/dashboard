import ko from 'knockout';
import DataClient from 'lib/dataClient';
import toastr from 'toastr';
import utils from 'lib/utils';

import 'widgets/text';
import 'widgets/date';
import 'widgets/chart';
import 'widgets/qrcode';

import BaseDataSource from 'data-sources/base';
import DateDataSource from 'data-sources/date';
import ServerDataSource from 'data-sources/serverData';
import SimpleGetDataSource from 'data-sources/simpleGet';
import ClientIdDataSource from 'data-sources/clientId';

import UafApp from 'lib/uafApp';

window.BaseDataSource = BaseDataSource;
window.DateDataSource = DateDataSource;
window.ServerDataSource = ServerDataSource;
window.SimpleGetDataSource = SimpleGetDataSource;
window.ClientIdDataSource = ClientIdDataSource;

class DashboardApp extends UafApp {
  constructor(dataClient, options) {
    super(dataClient, options);
  }

  begin() {
    this.registerApp('Dashboard', 'dashboard.client.html');
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

var client = new DataClient();
DataClient.default = client;

var app = new DashboardApp(client);
app.begin();

var qs = utils.parseQueryString();
if (qs.reloadCode) {
  app.restoreClients(qs.reloadCode);
}

ko.applyBindings();
