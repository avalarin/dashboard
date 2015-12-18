import ko from 'knockout';
import moment from 'moment';
import BaseDataSource from 'data-sources/base';

class DateDataSource extends BaseDataSource {
  constructor(options) {
    super(options);
    this.refresh();
    setInterval(() => this.refresh(), 1000);
  }

  refresh() {
    this.value = new Date();
  }
}

export default DateDataSource;
