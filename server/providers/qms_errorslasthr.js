var request = require("request");

function provider(callback) {
  var options = {
    uri: "http://logs.osmp.kz:9200/qms-service-*/_count",
    method: "POST",
    json: {"query":{"bool":{"must":[{"term":{"level":"error"}},{"range":{"@timestamp":{"gte":"now-1h"}}}]}}}
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body.count.toString());
    } else {
      callback("Error occured " + error);
    }
  });
}

module.exports = provider;
