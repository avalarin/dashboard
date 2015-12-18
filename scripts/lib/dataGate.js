import Event from 'lib/event';

class DataGate {
  constructor() {
    this.events = { };
    this.connected = new Event(this, 'connected');
  }

  initialize(url) {
    this._socket = new WebSocket(url);
    console.log('Connecting to', url);
    this._socket.onmessage = event => {
      console.log('Received from server', event.data)
      var message = JSON.parse(event.data);
      if (message.type == 'data') {
        this._receive(message.provider, message.data);
      }
    };
    this._socket.onopen = event => {
      console.log('Connected to', url);
      this._isConnected = true;
      this.connected.trigger();
    };
  }

  _receive(provider, data) {
    var ev = this.events[provider];
    if (ev) {
      ev.trigger(data);
    }
  }

  toDataProvider(provider, data) {
    var request = { type: 'data', provider: provider, data: data };
    this._socket.send(JSON.stringify(request));
  }

  subscribe(provider, callback) {
    var ev = this.events[provider];
    if (!ev) {
      ev = new Event(this, 'data');
      this.events[provider] = ev;
    }
    ev.subscribe((sender, data) => {
      callback(data);
    });
  }

  get isConnected() {
    return this._isConnected;
  }
}

var dataGate = new DataGate();
export default dataGate;
