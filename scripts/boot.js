require.config({
  baseUrl: 'scripts/',
  paths: {
    'knockout': '../components/knockout/dist/knockout',
    'requiretext': '../components/requirejs-text/text',
    'moment': '../components/moment/min/moment.min',
    'moment-ru': '../components/moment/locale/ru',
    'numeral': '../components/numeraljs/min/numeral.min'
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
