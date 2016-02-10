var path = require('path');
var fs = require('fs');

function readConfig(configPath) {
  var str = fs.readFileSync(configPath);
  return JSON.parse(str);
}

module.exports = function(context) {
  var configsPath = path.join(__dirname, '../../config');
  fs.readdirSync(configsPath).forEach(function(file) {
    var configPath = path.join(configsPath, file);
    var configName = file.replace(/\.[^/.]+$/, '');
    var config = readConfig(configPath);
    var key = 'config.' + configName;

    context.registerProvider(key, null, function functionName() {
      return config;
    });

    fs.watchFile(configPath, function(curr, prev) {
      config = readConfig(configPath);
      context.dataGate.publishData(key, config);
    });
  });
};
