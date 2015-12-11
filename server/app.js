var express = require("express");
var http = require("http");
var providers = require("./providers.js");

var app = express();


app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/proxy", function (req, res) {
  var sreq = http.get(req.query.url, function(sres) {
    var bodyChunks = [];
    sres.on("data", function(chunk) {
      bodyChunks.push(chunk);
    }).on("end", function() {
      var body = Buffer.concat(bodyChunks);
      res.send(body.toString());
    })
  });
});

app.get("/data/:name", function (req, res) {
  var name = req.params.name;
  var provider = providers[name];
  if (!provider) {
    res.send("Provider " + name + " not found.");
  }
  provider(function(data) {
    res.send(data);
  });
});

app.use(express.static("public"));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
