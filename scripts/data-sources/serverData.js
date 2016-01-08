import ko from 'knockout';
import BaseDataSource from 'data-sources/base';
import DataClient from 'lib/dataClient';

class ServerDataSource extends BaseDataSource {

  constructor(options) {
    super(options);
    this.key = options.key;

    this.refresh();

    DataClient.default.subscribe(this.key, message => {
      this.value = message.data;
    });
  }

  refresh() {
    DataClient.default.send('server.get', { tkey: this.key });
  }
}

export default ServerDataSource;
