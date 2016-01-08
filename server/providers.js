var path = require('path');
var fs = require('fs');
var extend = require("extend");
var fs = require("fs");

function initializer(context) {
  var providersPath = path.join(__dirname, "providers");
  var providers = {};
  var pcontext = {
    register: function(key, func) {
      providers[key] = func;
    }
  };
  extend(pcontext, context);

  fs.readdirSync(providersPath).forEach(function(file) {
    require("./providers/" + file)(pcontext);
  });

  return providers;
}


module.exports = initializer;
