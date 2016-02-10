import React from 'react';
import Widget from 'components/widget';
import moment from 'moment';
import Chart from 'chart';

class ChartWidget extends Widget {
  constructor(props) {
    super(props);

    this.source = props.source;

    this.state = {
      title: props.title,
      moreInfo: props.moreInfo,
      updatedAt: '',
      value: 0
    };

    this._chart = null;
    this._refreshCounter = 0;
    this._historyLength = 0;
  }

  render() {
    return <div className="widget" ref="root">
      <div className="title">{ this.state.title }</div>
      <div className="value">{ this.state.value }</div>
      <div className="more-info">{ this.state.moreInfo }</div>
      <div className="updated-at">{ this.state.updatedAt }</div>
      <canvas className="chart background" ref="chart"></canvas>
    </div>;
  }

  componentDidMount() {
    super.componentDidMount();

    this._attachChart();
  }

  componentWillUnmount() {
    this.source.destroy();

    clearInterval(this._intervalId);

    // TODO detach chart
  }

  componentDidUpdate() {
  }

  _onValueChanged() {
    this._lastValue = parseInt(this.source.value);
    if (isNaN(this._lastValue)) this._lastValue = 0;
  }

  _attachChart() {
    var canvas = this.refs.chart;
    var context = canvas.getContext("2d");

    setTimeout(() => {
      this._chart = new Chart(context).Line({
        labels: [],
        datasets: [{
          label: "Main",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: []
        }]}, {
          showTooltips: false,
          pointDot: false,
          animation: false,
          bezierCurve: false,
          scaleFontSize: 22,
          scaleLineColor: "rgba(255, 255, 255, 0.7)",
          scaleFontColor: "rgba(255, 255, 255, 0.7)",
          showScale: false
      });

      this._refreshChart();
      this._intervalId = setInterval(() => {
        this._refreshChart()
      }, 1000);
    }, 500);
  }

  _refreshChart() {
    if (!this._chart) return;

    this.setState({
      updatedAt: moment(this.source.updatedAt).format('hh:mm:ss'),
      value: this._lastValue
    });

    this._chart.addData([this._lastValue], '');
    if (this._historyLength > 60) {
      this._chart.removeData();
    } else {
      this._historyLength++;
    }
  }

}

export default ChartWidget;
