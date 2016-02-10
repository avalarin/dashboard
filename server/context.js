var path = require('path');
var fs = require('fs');
var extend = require('extend');
var CronJob = require('cron').CronJob;

module.exports = function(base) {
  var context = {
    providers: {},
    handlers: [],
    registerProvider: registerProvider,
    registerHandler: registerHandler,
    loadExtensions: loadExtensions,
    findHandler: findHandler
  }
  extend(context, base);

  context.dataGate = require("./lib/dataGate.js")(context);

  function registerProvider(key, scheduleStr, func) {
    console.info('Provider ' + key + ' registered');
    context.providers[key] = func;
    if (scheduleStr) {
      var job = new CronJob({
        cronTime: scheduleStr,
        onTick: function() {
          try {
            context.dataGate.publishData(key, func());
          } catch (e) {
            console.error('Cannot publish data ' + key, e);
          }
        },
        true: false
      }).start();
    }
  }

  function registerHandler(filter, func) {
    context.handlers.push({
      filter: createHandlerFilter(filter),
      func: func
    });
  }

  function loadExtensions() {
    var extPath = path.join(__dirname, "ext");
    fs.readdirSync(extPath).forEach(function(file) {
      var extension = require(path.join(extPath, file));
      if (typeof(extension) !== 'function') {
        console.error('Cannot initialize extension from ' + file + ': extensions is not a function');
        return;
      }
      extension(context);
    });
  }

  function findHandler(key) {
    for (var i = 0; i < context.handlers.length; i++) {
      var handler = context.handlers[i];
      if (handler.filter(key)) {
        return handler.func;
      }
    }
    return null;
  }

  function createHandlerFilter(filter) {
    if (filter instanceof RegExp) {
      return function(key) { return filter.test(key); };
    }
    return function(key) { return key === filter };
  }

  return context;
};
