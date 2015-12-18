import ko from 'knockout';
import moment from 'moment';
import TextWidget from 'widgets/text';

class DateWidget extends TextWidget {
  constructor(options, element) {
    super(options, element);

    this.format = options.format;
    this._onChanged();
  }

  _onChanged() {
    this.updatedAt(this.source.updatedAt);
    var value = this.source.value;
    var formatted = moment(value).format(this.format);
    this.value(formatted);
  }
}

TextWidget.register('date', DateWidget, 'text.html');
