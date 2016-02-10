var defaults = {
  rows: null,
  columns: 6
};

var Empty = new (function Empty() {});

class Grid {
  constructor(items, options) {
    this.items = items.slice(0); // клонирование массива
    this.options = Object.assign({}, defaults, options);
    this.buildGrid();
  }

  buildGrid() {
    this._resetGrid();
    var position = [0,0];
    this.items.forEach(item => {
      if (this.options.columns && item.w > this.options.columns ||
          this.options.rows && item.y > this.options.rows) {
        throw 'cannot_place_too_big';
      }

      if (!item.w) item.w = 1;
      if (!item.h) item.h = 1;

      position = this._findPlaceForItem(item, position);
      this._placeItem(item, position);
    });
  }

  _placeItem(item, position) {
    item.x = position[0];
    item.y = position[1];
    for (var dx = item.x; dx < item.x + item.w; dx++) {
      for (var dy = item.y; dy < item.y + item.h; dy++) {
        this.grid[dx][dy] = item;
      }
    }
  }

  _findPlaceForItem(item, position) {
    var x, y;
    for (y = position[1]; y < this._currentRows; y++) {
      for (x = position[0]; x < this._currentColumns; x++) {
        if (this._checkPlace(x, y, item.w, item.h)) {
          return [x, y];
        }
      }
    }

    if (x == this._currentColumns && !this.options.columns) {
      this._addColumn();
      return this._findPlaceForItem(item, [ position[0] + 1, position[1] ]);
    }

    if (y == this._currentRows && !this.options.rows) {
      this._addRow();
      return this._findPlaceForItem(item, [ 0, position[1] + 1 ]);
    }

    console.error('Cannot place item (no space)', item, 'position', position)
    throw 'cannot_place_no_space';
  }

  _checkPlace(x, y, w, h) {
    var addColumns = Math.max(x + w - this._currentColumns, 0),
        addRows = Math.max(y - h - this._currentRows, 0),
        mx = Math.min(x + w, this._currentColumns),
        my = Math.min(y + h, this._currentRows);

    for (var dx = x; dx < mx; dx++) {
      for (var dy = y; dy < my; dy++) {
        if (!this._isEmpty(dx, dy)) return false;
      }
    }

    if (addColumns && this.options.columns ||
        addRows && this.options.rows) {
          return false;
    }

    for (var i = 0; i < addColumns; i++) { this._addColumn(); }
    for (var i = 0; i < addRows; i++) { this._addRow(); }

    return true;
  }

  _resetGrid() {
    this.grid = [];
    this._currentColumns = 0;
    this._currentRows = this.options.rows || 1;

    if (this.options.columns) {
      for (var i = 0; i < this.options.columns; i++) {
        this._addColumn();
      }
    }
  }

  _addColumn() {
    this._currentColumns++;
    var column = [];
    for (var i = 0; i < this._currentRows; i++) {
      column.push(Empty);
    }
    this.grid.push(column);
  }

  _addRow() {
    this._currentRows++;
    this.grid.forEach(column => {
      column.push(Empty);
    });
  }

  _isEmpty(x, y) {
    return this.grid[x][y] === Empty;
  }
}

export default Grid;
