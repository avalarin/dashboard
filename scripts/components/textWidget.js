import React from 'react';
import Widget from 'components/widget';
import moment from 'moment';

class TextWidget extends Widget {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      moreInfo: props.moreInfo,
      updatedAt: '',
      value: ''
    };
  }

  render() {
    return <div className="widget" ref="root">
      <div className="title">{ this.state.title }</div>
      <div className="value">{ this.state.value }</div>
      <div className="more-info">{ this.state.moreInfo }</div>
      <div className="updated-at">{ this.state.updatedAt }</div>
    </div>;
  }

  _onValueChanged() {
    this.setState({
      updatedAt: moment(this.source.updatedAt).format('hh:mm:ss'),
      value: this._multilineText(this._formatValue(this.source.value))
    });
  }

  _formatValue(value) {
    return '' + value;
  }

  _multilineText(value) {
    return value.replace('<br/>', '\n');
  }

}

export default TextWidget;
