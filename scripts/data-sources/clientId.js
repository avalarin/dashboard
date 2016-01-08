import BaseDataSource from 'data-sources/base';
import DataClient from 'lib/dataClient';

class ClientIdDataSource extends BaseDataSource {
  constructor(options) {
    super(options);

    this.value = "";
    DataClient.default.connected.subscribe(() => {
      this.value = DataClient.default.clientId;
    });
  }
}

export default ClientIdDataSource;
