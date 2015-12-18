import ko from 'knockout';
import BaseDataSource from 'data-sources/base';

class SimpleGetDataSource extends BaseDataSource {
  constructor(options) {
    super(options);
    this.url = options.url;

    this.refresh();
  }

  refresh() {
    // $.ajax({
    //   url: '/proxy',
    //   data: { url: this.url },
    //   success: data => {
    //     this.value = data;
    //   }
    // });
    this.value = (new Date());
  }
}

export default SimpleGetDataSource;
