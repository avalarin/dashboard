import ko from 'knockout';
import moment from 'moment';

class TextWidget {
  constructor(options) {
    this.title = ko.observable(options.title || 'Без заголовка');
    this.text = ko.observable(options.text);
    this.moreInfo = ko.observable(options.moreInfo);
    this.updatedAt = ko.observable(new Date());

    this.text.subscribe(() => {
      this.refreshUpdatedAt();
    });
  }

  refreshUpdatedAt() {
    this.updatedAt(new Date());
  }
}

class DateWidget extends TextWidget {
  constructor(options) {
    super(options);

    this.format = options.format || 'LLL';

    this.refresh()
    setInterval(() => this.refresh(), 1000);
  }

  refresh() {
    this.text(moment(new Date()).format(this.format));
  }
}

ko.components.register('text-widget', {
  viewModel: params => new TextWidget(params),
  template: { require: 'requiretext!../widgets/text.html' }
});

ko.components.register('date-widget', {
  viewModel: params => new DateWidget(params),
  template: { require: 'requiretext!../widgets/text.html' }
});

export { TextWidget, DateWidget };
