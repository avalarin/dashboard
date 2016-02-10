import Event from 'lib/event';

class BaseDataSource {
  constructor(options) {
    options = options || {};
    this._value = options.value;
    this._changed = new Event(this, 'changed');
    this._updatedAt = new Date();
  }

  refreshUpdatedAt() {
    this._updatedAt = new Date();
    this._changed.trigger(this._value);
  }

  refresh() {

  }

  destroy() {
    
  }

  get changed() {
    return this._changed;
  }

  get value() {
    return this._value;
  }

  set value(v) {
    this._value = v;
    this._updatedAt = new Date();
    this._changed.trigger(v);
  }

  get updatedAt() {
    return this._updatedAt;
  }

}

export default BaseDataSource;
