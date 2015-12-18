class Event {
  constructor(owner, name) {
    this.subscribers = [];
    this.owner = owner;
    this.name = name;
  }

  subscribe(func) {
    this.subscribers.push(func);
  }

  unsubscribe(func) {
    var index = this.subscribers.indexOf(func);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  trigger(obj) {
    this.subscribers.forEach(s => {
      s(this.owner, obj);
    });
  }
}

export default Event;
