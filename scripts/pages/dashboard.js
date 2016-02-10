import DataClient from 'lib/dataClient';
import DashboardApp from 'ext/dashboard/app';
import utils from 'lib/utils';

import React from 'react';
import ReactDOM from 'react-dom';
import Grid from 'components/grid';
import TextWidget from 'components/textWidget';
import DateWidget from 'components/dateWidget';
import QRCodeWidget from 'components/qrcodeWidget';
import ConnectClientWidget from 'components/connectClientWidget';

import DateTimeSource from 'data-sources/date';
import ClientIdDataSource from 'data-sources/clientId';

var client = new DataClient();
DataClient.default = client;

var app = new DashboardApp(client);
app.begin();

var qs = utils.parseQueryString();
if (qs.reloadCode) {
  app.restoreClients(qs.reloadCode);
}
