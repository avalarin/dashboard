import React from 'react';
import ReactDOM from 'react-dom';
import Grid from 'components/grid';
import ErrorWidget from 'components/errorWidget';

class Builder {

  static _buildWidget(index, config, callback) {
    var widgetPath = 'components/' + config.widget + 'Widget';
    var dsourcePath = 'data-sources/' + config.source;

    require([widgetPath, dsourcePath], (widgetClass, dsourceClass) => {
      if (!widgetClass) {
        callback(index, <ErrorWidget text={`Widget ${config.widget} not found`} />);
        return;
      }

      if (!widgetClass) {
        callback(index, <ErrorWidget text={`Data source ${config.source} not found`} />);
        return;
      }

      var dsource = new dsourceClass.default(config.sourceParams || {});
      var widgetOptions = Object.assign({
        grid_size: config.size,
        source: dsource,
        key: `widget-${config.widget}-${index}`
      }, config.widgetParams);

      var widget = React.createElement(widgetClass.default, widgetOptions);
      callback(index, widget);
    });
  }

  static buildWidgets(config, element) {
    var count = config.length;
    var widgets = new Array(config.length);
    for (var i = 0; i < config.length; i++) {
      var c = config[i];
      Builder._buildWidget(i, c, (i2, w) => {
        widgets[i2] = w;
        if (!(--count)) Builder._complete(widgets, element);
      });
    }
  }

  static _complete(widgets, element) {
    element.innerHTML = '';
    ReactDOM.render(React.createElement(Grid, null, widgets), element);
  }
}

export default Builder;
