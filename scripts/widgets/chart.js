import ko from 'knockout';
import moment from 'moment';
import Chart from 'chart';
import TextWidget from 'widgets/text';

class ChartWidget extends TextWidget {
  constructor(options, element) {
    super(options, element);

    var canvas = element.getElementsByTagName('canvas')[0];
    this._context = canvas.getContext("2d");
    this._refreshCounter = 0;
    this.historyLength = 0;

    setTimeout(() => {
      this._createChart();
      this._refresh(true);
      setInterval(() => this._refresh(), 100);
    }, 100);
  }

  _createChart() {
    this._chart = new Chart(this._context).Line({
      labels: [],
      datasets: [{
        label: "My First dataset",
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
  }

  _refresh(force) {
    if (!this._chart) return;
    if (force || this._refreshCounter == 0) {
      this._refreshCounter = 10;
      var intValue = parseInt(this.value());
      if (isNaN(intValue)) intValue = 0;
      this._chart.addData([intValue], '');
      if (this.historyLength > 60) {
        this._chart.removeData();
      } else {
        this.historyLength++;
      }
    } else {
      this._refreshCounter--;
    }
  }

  _onChanged() {
    this.updatedAt(this.source.updatedAt);
    this.value(this.source.value);

    this._refresh(true);
  }
}

TextWidget.register('chart', ChartWidget, 'chart.html');
