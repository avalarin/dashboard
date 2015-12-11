import ko from 'knockout';

import { TextWidget } from 'widgets/text';

class SimpleGetWidget extends TextWidget {

  constructor(options) {
    super(options);
    this.url = options.url;

    this.refresh();
  }

  refresh() {
    $.ajax({
      url: '/proxy',
      data: { url: this.url },
      success: data => {
        this.text(data)
      }
    });
  }
}

ko.components.register('simple-get-widget', {
  viewModel: params => new SimpleGetWidget(params),
  template: { require: 'requiretext!../widgets/text.html' }
});
