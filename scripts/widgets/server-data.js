import ko from 'knockout';

import { TextWidget } from 'widgets/text';

class ServerDataWidget extends TextWidget {

  constructor(options) {
    super(options);
    this.provider = options.provider;

    this.refresh();
    setInterval(() => this.refresh(), 1000);
  }

  refresh() {
    $.ajax({
      url: '/data/' + this.provider,
      success: data => {
        this.text(data)
      },
      complete: () => {
        this.refreshUpdatedAt();
      }
    });
  }
}

ko.components.register('server-data-widget', {
  viewModel: params => new ServerDataWidget(params),
  template: { require: 'requiretext!../widgets/text.html' }
});
