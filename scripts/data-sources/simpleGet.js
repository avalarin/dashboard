import ko from 'knockout';
import BaseDataSource from 'data-sources/base';
import DataClient from 'lib/dataClient';

class SimpleGetDataSource extends BaseDataSource {

  constructor(options) {
    super(options);
    this.url = options.url;

    this.refresh();
  }

  refresh() {
    DataClient.default.send('server.proxy', { url: this.url }, (message) => {
      this.value = message.data;
    });
  }
}

export default SimpleGetDataSource;
