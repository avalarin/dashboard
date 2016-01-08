import 'paper';

class Hunter {
  constructor(game) {
    this.angle = 0;
    this.game = game;
    this.group = new Group();
    this.group.transformContent = false;

    this.platform = new Path.Rectangle(0, this.game.height - this.game.segmentSize, this.game.width, this.game.segmentSize);
		this.platform.fillColor = new Color(0, 0.5)
		this.platform.selected = true;

		var lx0 = this.game.width / 2;
		var ly0 = this.game.height - this.game.segmentSize;
		var lx1 = this.game.width / 2;
		var ly1 = this.game.height - this.game.segmentSize * this.game.segmentMultipler;

    this.line = new Path.Line(lx0, ly0, lx1, ly1);
		this.line.pivot = new Point(lx0, ly0);
		this.line.selected = true;

    this.group.addChild(this.platform);
    this.group.addChild(this.line);
  }

  shot() {
    var wb = this.game.createWhizzbang(this.angle);
    this.group.addChild(wb.circle);
  }

  setDirectionByAngle(angle) {
    var cangle = (angle - this.angle) * 180 / Math.PI
		this.line.rotate(cangle);
    this.angle = angle;
	}

}

export default Hunter;
