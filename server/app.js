var express = require("express");
var http = require("http");
var server = http.createServer();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server: server });

var context = {
  wss: wss
};

context.dataGate = require("./lib/dataGate.js")(context);
context.providers = require("./providers.js")(context);

var app = express();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

// app.get("/proxy", function (req, res) {
//   var sreq = http.get(req.query.url, function(sres) {
//     var bodyChunks = [];
//     sres.on("data", function(chunk) {
//       bodyChunks.push(chunk);
//     }).on("end", function() {
//       var body = Buffer.concat(bodyChunks);
//       res.send(body.toString());
//     })
//   });
// });

// app.get("/data/:name", function (req, res) {
//   var name = req.params.name;
//   var provider = context.providers[name];
//   if (!provider) {
//     res.send("Provider " + name + " not found.");
//   }
//   provider(function(data) {
//     res.send(data);
//   });
// });

app.use(express.static("public"));

server.on('request', app);
server.listen(3000, function () { console.log('Listening on ' + server.address().port) });
