import ko from 'knockout';
import DataClient from 'lib/dataClient';

import 'widgets/text';
import 'widgets/date';
import 'widgets/chart';

import BaseDataSource from 'data-sources/base';
import DateDataSource from 'data-sources/date';
import ServerDataSource from 'data-sources/serverData';
import SimpleGetDataSource from 'data-sources/simpleGet';

window.BaseDataSource = BaseDataSource;
window.DateDataSource = DateDataSource;
window.ServerDataSource = ServerDataSource;
window.SimpleGetDataSource = SimpleGetDataSource;

// var tiles = [
//   [
//     { widget: DateWidget, title: "Дата и время", size: "1x1", color: "red", format: "D.M.YYYY<br/>hh:mm", source: new DateDataSource() },
//     { widget: TextWidget, title: "IP", size: "2x1", color: "blue", moreInfo: "from http://ipinfo.io/ip", source: new SimpleGetDataSource({ url: "http://ipinfo.io/ip" }) },
//     { widget: DateWidget, title: "Дата и время", size: "1x1", color: "red", format: "D.M.YYYY<br/>hh:mm", source: new DateDataSource() },
//     { widget: TextWidget, title: "IP", size: "2x1", color: "blue", moreInfo: "from http://ipinfo.io/ip", source: new SimpleGetDataSource({ url: "http://ipinfo.io/ip" }) },
//   ],
//   { widget: ChartWidget, title: "Секунды", size: "3x2", color: { "40": "green", "45": "orange", "50": "red" }, source: new ServerDataSource({ provider: "seconds" }) },
//   [
//     { widget: DateWidget, title: "Дата и время", size: "1x1", color: "red", format: "D.M.YYYY<br/>hh:mm", source: new DateDataSource() },
//     { widget: TextWidget, title: "IP", size: "2x1", color: "blue", moreInfo: "from http://ipinfo.io/ip", source: new SimpleGetDataSource({ url: "http://ipinfo.io/ip" }) },
//     { widget: DateWidget, title: "Дата и время", size: "1x1", color: "red", format: "D.M.YYYY<br/>hh:mm", source: new DateDataSource() },
//     { widget: TextWidget, title: "IP", size: "2x1", color: "blue", moreInfo: "from http://ipinfo.io/ip", source: new SimpleGetDataSource({ url: "http://ipinfo.io/ip" }) },
//   ],
//   { widget: ChartWidget, title: "Секунды", size: "3x2", color: { "40": "green", "45": "orange", "50": "red" }, source: new ServerDataSource({ provider: "seconds" }) }
//
// ]
//
// function processTiles(tiles) {
//
//   tiles.fo
//
//
// }

var client = new DataClient("ws://localhost:3000");
DataClient.default = client;

ko.applyBindings();
