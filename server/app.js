var express = require("express");
var http = require("http");
var server = http.createServer();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server: server });

var context = require("./context.js")({
  wss: wss
});
context.loadExtensions();

var app = express();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use(express.static("public"));

server.on('request', app);
server.listen(3000, function () { console.log('Listening on ' + server.address().port) });
