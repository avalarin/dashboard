var request = require("request");

function provider(context, schedule) {
  var options = {
    uri: "http://logs.osmp.kz:9200/qms-service-*/_count",
    method: "POST",
    json: {"query":{"bool":{"must":[{"term":{"level":"error"}},{"range":{"@timestamp":{"gte":"now-1h"}}}]}}}
  };
  
  return function(cb) {
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        cb(body.count.toString());
      } else {
        cb("Error occured " + error);
      }
    });
  }
}

module.exports = provider;
