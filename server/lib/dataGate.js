var randomstring = require("randomstring");
var extend = require("extend");
var WebSocket = require('ws');

function initializer(context) {
  var wss = context.wss;
  var subscribers = {};
  var clients = {};

  wss.broadcast = function(data) {
    wss.clients.forEach(function(client) {
      client.send(data);
    });
  };

  wss.on('connection', function(ws) {
    var client = createClientContext(ws);
    console.log('Client ' + client.id + ' connected');
    send('server.connected', client);

    ws.on('message', function(messageStr) {
      // console.info('Message received from ' + client.id + ' ' + messageStr);
      var message = JSON.parse(messageStr);
      receive(client, message);
    });

    ws.on('close', function() {
      unsubscribe(client);
      console.log('Client ' + client.id + ' disconnected');
    });
  });

  function receive(client, message) {
    if (message.key == 'server.subscribe') {
        var tkey = message.tkey;
        subscribe(tkey, client);
        return;
    }
    if (message.key == 'server.get') {
        var tkey = message.tkey;
        var provider = context.providers[tkey];

        if (!provider) {
          send('server.error', client, { message: 'key ' + tkey + ' is not registred' });
          return;
        }

        var data = provider();
        send(tkey, client, { data: data });
        return;
    }

    var handler = context.findHandler(message.key);
    if (handler) {
      handler(client, message);
    }

    // getSubscribers(message.key).forEach(function(subscriber) {
    //   // clients messages sends only to local subscribers
    //   if (subscriber.callback) {
    //     subscriber.callback(client, message);
    //   }
    // });
  }

  function createClientContext(ws) {
    var id = randomstring.generate(6);
    while (clients[id]) {
      id = randomstring.generate(6);
    }
    var context = {
      id: id,
      ws: ws,
      subscribes: []
    };
    clients[id] = context;
    return context;
  }

  function getSubscribers(key) {
    return subscribers[key] || [];
  }

  function send(key, client, message) {
    message = createMessage(key, client, message);
    var messageStr = JSON.stringify(message);

    if (client.ws.readyState == WebSocket.CLOSED) {
      console.log('Cannot send to ' + client.id + ': disconnected');
      return;
    }

    client.ws.send(messageStr);
    // console.info('Send message to ' + client.id + ' ' + messageStr);
  }

  function sendResponse(original, client, message) {
    var response = { response: original.id };
    extend(response, message);
    send(original.key, client, response);
  }

  function publishData(key, data) {
    getSubscribers(key).forEach(function(subscriber) {
      send(key, subscriber.client, { data: data });
    });
  }

  function createMessage(key, client, message) {
    var newMessage = { key: key, clientId: client.id };
    extend(newMessage, message);
    return newMessage;
  }

  function subscribe(key, client) {
    var subscriber = {
      client: client
    };
    var subs = subscribers[key];
    if (!subs) {
      subs = [];
      subscribers[key] = subs;
    }

    for (var i = 0; i < subs.length; i++) {
      if (subs[i].client.id == client.id) {
        console.log('Client ' + client.id + ' already subscribed to ' + key);
        return;
      }
    }

    subs.push(subscriber);
    client.subscribes.push(key);

    console.log('Client ' + client.id + ' subscribed to ' + key);
  }

  function unsubscribe(client) {
    client.subscribes.forEach(function(key) {
      var subs = subscribers[key];
      for (var i = 0; i < subs.length; i++) {
        if (subs[i].client.id == client.id) {
          subs.splice(i, 1);
          console.log('Client ' + client.id + ' unsubscribed from ' + key);
          break;
        }
      }
    });
  }

  return {
    publishData: publishData,
    subscribe: subscribe,
    send: send,
    sendResponse: sendResponse
  }
}

module.exports = initializer;
