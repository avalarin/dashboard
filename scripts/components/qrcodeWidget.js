import React from 'react';
import Widget from 'components/widget';
import moment from 'moment';
import 'qrcode';

class QRCodeWidget extends Widget {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      moreInfo: props.moreInfo,
      updatedAt: '',
      value: 'T'
    };
  }

  render() {
    return <div className="widget" ref="root">
      <div className="title">{ this.state.title }</div>
      <a href={ this.state.value }>
        <div className="qrcode" ref="qrcode"></div>
      </a>
    </div>;
  }

  componentDidMount() {
    super.componentDidMount();

    this._attachQRCode();
  }

  componentWillUnmount() {
    this.source.destroy();

    // TODO detach QRCode
  }

  _onValueChanged(value) {
    value = this._formatValue(value);
    this.setState({
      updatedAt: moment(this.source.updatedAt).format('hh:mm:ss'),
      value: value
    });

    if (!this.qrcode) return;
    this.qrcode.clear();
    this.qrcode.makeCode(value);
  }

  _formatValue(value) {
    return '' + value;
  }

  _attachQRCode() {
    setTimeout(() => {
      var root = this.refs.root;
      var element = this.refs.qrcode;
      var s = Math.min(root.offsetWidth - 20, root.offsetHeight - 70);
      this.qrcode = new QRCode(element, {
        text: this.state.value,
        width: s,
        height: s,
        colorDark : "white",
        colorLight : "transparent"
      });
    }, 500);
  }

}

export default QRCodeWidget;
