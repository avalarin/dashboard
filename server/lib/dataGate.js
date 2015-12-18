function initializer(context) {
  var wss = context.wss;
  var subscribers = {};

  wss.broadcast = function(data) {
    wss.clients.forEach(function(client) {
      client.send(data);
    });
  };

  wss.on('connection', function(ws) {
    ws.on('message', function(message) {
      var clientContext = {
        publishData: function(provider, data) {
          ws.send(JSON.stringify({
            type: "data",
            provider: provider,
            data: data
          }));
        }
      };

      var obj = JSON.parse(message);
      if (obj.type == 'data') {
        var subs = subscribers[obj.provider];
        if (subs) {
          subs.forEach(function(sub) {
            sub(clientContext, obj.data);
          });
        }
      }
    });
  });

  return {
    publishData: function publishData(provider, data) {
      context.wss.broadcast(JSON.stringify({
        type: "data",
        provider: provider,
        data: data
      }));
    },
    subscribeData: function subscribeData(provider, callback) {
      var subs = subscribers[provider];
      if (!subs) {
        subs = [];
        subscribers[provider] = subs;
      }
      subs.push(callback);
    }
  }
}

module.exports = initializer;
