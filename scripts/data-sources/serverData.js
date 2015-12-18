import ko from 'knockout';
import BaseDataSource from 'data-sources/base';
import dataGate from 'lib/dataGate';

class ServerDataSource extends BaseDataSource {

  constructor(options) {
    super(options);
    this.provider = options.provider;

    this.refresh();
    dataGate.subscribe(this.provider, data => {
      this.value = data;
    });
  }

  refresh() {
    if (!dataGate.isConnected) {
        dataGate.connected.subscribe(() => {
          console.log('connected, refresh data')
          dataGate.toDataProvider(this.provider);
        });
    } else {
      dataGate.toDataProvider(this.provider);
    }
  }
}

export default ServerDataSource;
