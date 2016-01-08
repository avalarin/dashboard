var request = require("request");

module.exports = function(context) {
  context.registerHandler("server.proxy", function(client, message) {
    request(message.url, function (error, res, body) {
      context.dataGate.sendResponse(message, client, { data: body.toString() });
    });
  });
};
