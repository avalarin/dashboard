var path = require('path');
var fs = require('fs');
var schedule = require('node-schedule');

function initializer(context) {
  var providersPath = path.join(__dirname, "providers");
  var providers = {};

  require("fs").readdirSync(providersPath).forEach(function(file) {
    var provider = require("./providers/" + file);
    var name = file.replace(/\.[^/.]+$/, "");
    providers[name] = provider(context, schedule);
  });

  return providers;
}

module.exports = initializer;
