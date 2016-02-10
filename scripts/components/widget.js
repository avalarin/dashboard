import React from 'react';

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.source = props.source;
  }

  componentDidMount() {
    this.source.changed.subscribe((sender, value) => {
      this._onValueChanged(value);
    });
    this._onValueChanged(this.source.value);
  }

  componentWillUnmount() {
    this.source.destroy();
  }

  _onValueChanged() {

  }

}

export default Widget;
