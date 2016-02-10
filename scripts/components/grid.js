import React from 'react';
import Grid from 'lib/grid';

class GridComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cellWidth: 0,
      cellHeight: 0
    };

    this.state.items = props.children.map((item, i) => {
      var size = item.props.grid_size;
      var sizeParts = size.split('x');
      var w = parseInt(sizeParts[0]),
          h = parseInt(sizeParts[1] || w);

      return {
        w: w, h: h,
        x: null, y: null,
        key: `tile-${i}`,
        component: item
      }
    });

    this.grid = new Grid(this.state.items);
  }

  render() {
    return <div className="tiles-container" ref="container">
      { this.state.items.map((item, i) => {
        // var style = this._getStyle(item);
        item.tileComponent = <div key={item.key} className="tile" ref={item.key}>
          {item.component}
        </div>
        return item.tileComponent;
      }) }
    </div>
  }

  componentDidMount() {
    this._calculateCellSize();
    this._rebuild();
  }

  componentWillUnmount() {
    // this.source.destroy();
  }

  _calculateCellSize() {
    var element = this.refs.container;
    var w = Math.floor((element.clientWidth - 20) / this.props.columns);
    var h = w / this.props.cellAspectRatio;
    this.state.cellWidth = w;
    this.state.cellHeight = h;
  }

  _rebuild() {
    this.state.items.map((item, i) => {
      var element = this.refs[item.key];
      element.style.position = 'absolute';

      var height = (this.state.cellHeight * item.h) - this.props.cellPadding;

      element.style.width = (this.state.cellWidth * item.w) - this.props.cellPadding + 'px';
      element.style.height = height + 'px';
      element.style.left = (this.state.cellWidth * item.x) + 'px';
      element.style.top = (this.state.cellHeight * item.y) + 'px';


      element.childNodes[0].style.height = (height - 18) + 'px';
    });
  }

  _getStyle(item) {
    return {
      position: 'absolute',
      width: (this.state.cellWidth * item.w) - this.props.cellPadding + 'px',
      height: (this.state.cellHeight * item.h) - this.props.cellPadding + 'px',
      left: (this.state.cellWidth * item.x) + 'px',
      top: (this.state.cellHeight * item.y) + 'px'
    };
  }
}

GridComponent.defaultProps = {
  columns: 6,
  rows: null,
  cellPadding: 10,
  cellAspectRatio: 1
};

export default GridComponent;
