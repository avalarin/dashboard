import React from 'react';
import Widget from 'components/widget';
import moment from 'moment';

class ErrorWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Error',
      moreInfo: props.moreInfo,
      value: props.text
    };
  }

  render() {
    return <div className="widget" ref="root">
      <div className="title">{ this.state.title }</div>
      <div className="value">{ this.state.value }</div>
      <div className="more-info">{ this.state.moreInfo }</div>
    </div>;
  }

  _onValueChanged() {
  }
}

export default ErrorWidget;
