import 'paper';

class Victim {
  constructor(game) {
    this.game = game;
    this.lastSpeed = this.game.speed;
    this.group = new Group();
		this.group.transformContent = false;

		var sqRootPoints = Math.max(this.game.minSegmentMultipler, Math.ceil(Math.random() * this.game.segmentMultipler));
		var width = sqRootPoints * this.game.segmentSize;
		var height = sqRootPoints * this.game.segmentSize;
		var canvasSegmentLength = (this.game.width / 2 - width) / this.game.segmentSize;
		var divx = Math.round(Math.random() * canvasSegmentLength) * this.game.segmentSize;

    this.life = 1;
    this.points = sqRootPoints * sqRootPoints;

		var x = this.game.victimsCounter * (this.game.width / 2) + divx;
		var y = -height;
		this.group.position.x = x;
		this.group.position.y = y;

		this.rect = new Path.Rectangle(0, 0, width, height);
		this.rect.fillColor = new Color(0, 0.5);
		this.rect.selected = true;
		this.group.addChild(this.rect);

		var text = new PointText(width / 2, height / 2);
		text.justification = "center";
		text.fillColor = "black";
		text.content = this.group.toString();
		this.group.addChild(text);

		this.group.data = {
			item: this.rect,
			hitTestData: [ width, height ]
		}

		this.group.onFrame = (event) => this.onFrame(event);
		this.game.victimsCounter = Math.abs(this.game.victimsCounter - 1);
  }

  onFrame(event) {
    if (this.group.position.y < this.game.height) {
      this.group.position.y += this.lastSpeed * event.delta;
    } else {
      this.group.remove();
      this.group.onDestruct({item: this});
    }
  }

  setColorAlpha(value) {
    this.rect.fillColor.alpha = value;
  }

  remove() {
    this.group.remove();
  }
}

export default Victim;
