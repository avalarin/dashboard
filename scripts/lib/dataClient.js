import Event from 'lib/event';

class DataClient {
  constructor(url) {
    this.events = { };
    this.connected = new Event(this, 'connected');
    this.clientId = null;
    this._socket = new WebSocket(url);
    console.log('Connecting to', url);

    this._socket.onmessage = event => {
      console.log('Received from the server', event.data)
      var message = JSON.parse(event.data);

      if (message.key == 'server.connected') {
        console.log('Server connected, client id', message.clientId);
        this._isConnected = true;
        this.connected.trigger();
        return;
      }

      if (!this._isConnected) return;
      this._receive(message);
    };

    this._socket.onopen = event => {
      console.log('Socket opened', url);
    };
  }

  _receive(message) {
    var ev = this.events[message.key];
    if (ev) ev.trigger(message);
  }

  send(key, message) {
    message = message || {};
    message.key = key;
    var messageStr = JSON.stringify(message);
    console.log('Send to the server', messageStr);
    this._socket.send(messageStr);
  }

  subscribe(key, callback) {
    this.mustBeConnected(() => {
      this.send('server.subscribe', { tkey: key });
    });

    var ev = this.events[key];
    if (!ev) {
      ev = new Event(this, 'data');
      this.events[key] = ev;
    }
    ev.subscribe((sender, message) => {
      callback(message);
    });
  }

  mustBeConnected(callback) {
    if (!this.isConnected) {
      this.connected.subscribe(callback);
    } else {
      callback();
    }
  }

  get isConnected() {
    return this._isConnected;
  }
}

DataClient.default = null;

export default DataClient;
