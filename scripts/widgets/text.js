import ko from 'knockout';

class TextWidget {
  constructor(options, element) {
    options = options || {};

    this.size = options.size || '1x1';
    this.title = ko.observable(options.title || 'Без заголовка');
    this.moreInfo = ko.observable(options.moreInfo);
    this.source = options.source;

    this.updatedAt = ko.observable();
    this.value = ko.observable();

    this._onChanged();
    this.source.changed.subscribe((sender, value) => {
      this._onChanged();
    });

    this.color = ko.computed(() => {
      if (!options.color) return null;
      if (typeof(options.color) === 'string') {
        return options.color;
      }
      var value = this.value();
      var lastKey;
      for (var key in options.color) {
        if (!options.color.hasOwnProperty(key)) continue;
        if (!lastKey) {
          lastKey = key;
        }
        var kv = parseFloat(key);
        if (kv > value) break;
        lastKey = key;
      }
      return lastKey ? options.color[lastKey] : null;
    });

    element.className += `tile tile-${this.size}`;
    element.onclick = () => this.source.refresh();
  }

  _onChanged() {
    this.updatedAt(this.source.updatedAt);
    this.value(this.source.value);
  }

  static register(name, wclass, template) {
    ko.components.register(`${name}-widget`, {
      viewModel: {
        createViewModel: (params, componentInfo) => new wclass(params, componentInfo.element)
      },
      template: { require: `requiretext!../widgets/${template}` }
    });
  }
}

TextWidget.register('text', TextWidget, 'text.html');

export default TextWidget;
