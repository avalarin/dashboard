import ko from 'knockout';
import TextWidget from 'widgets/text';
import 'qrcode';

class QRCodeWidget extends TextWidget {
  constructor(options, element) {
    super(options, element);

    this._element = element.getElementsByClassName('qrcode')[0];
    this.format = options.format;
    this._onChanged();
  }

  _onChanged() {
    if (!this._element) return;

    this.updatedAt(this.source.updatedAt);
    var value = this.source.value;
    if (this.format) {
      value = this.format(value);
    }
    this.value(value);
    this._element.style.top = '5px';
    this._element.style.left = '25px';
    new QRCode(this._element, {
      text: this.value(),
        width: 250,
        height: 250,
        colorDark : "white",
        colorLight : "transparent"
    });
  }
}

TextWidget.register('qrcode', QRCodeWidget, 'qrcode.html');
