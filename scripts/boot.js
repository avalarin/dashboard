require.config({
  baseUrl: 'scripts/',
  paths: {
    'jquery': '../components/jquery/dist/jquery.min',
    'knockout': '../components/knockout/dist/knockout',
    'requiretext': '../components/requirejs-text/text',
    'moment': '../components/moment/min/moment.min',
    'moment-ru': '../components/moment/locale/ru',
    'numeral': '../components/numeraljs/min/numeral.min',
    'chart': '../components/chart.js/chart.min',
    'paper': '../components/paper/dist/paper-full.min',
    'qrcode': '../components/qrcode-js/qrcode',
    'toastr': '../components/toastr/toastr.min'
  }
});

require(['knockout', 'lib/ko-moment', 'moment', 'moment-ru', 'numeral'], function() {
  var ko = require('knockout');
  var moment = require('moment');
  var numeral = require('numeral');

  moment.locale('ru');

  var jspath = 'scripts/pages/' + $('body').attr('data-jspath');
  require([jspath], function() {});
});
