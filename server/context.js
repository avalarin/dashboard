var path = require('path');
var fs = require('fs');
var extend = require('extend');
var schedule = require('node-schedule');

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
    context.providers[key] = func;

    if (scheduleStr) {
      schedule.scheduleJob(scheduleStr, function() {
        context.dataGate.publishData(key, func());
      });
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
      require(path.join(extPath, file))(context);
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
