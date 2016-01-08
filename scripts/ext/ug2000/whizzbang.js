import 'paper';

class Whizzbang {
  constructor(game, angle) {
    this.game = game;
    this.angle = angle;
    this.x = game.width / 2;
    this.y = game.height - game.segmentSize;
    this.directionX = 1;
		this.directionY = 1;
    this.livetime = 0;

    this.circle = new Path.Circle(new Point(this.x, this.y), game.segmentSize / 2);
		this.circle.position.x += game.segmentSize * game.segmentMultipler * Math.sin(this.angle);
		this.circle.position.y += game.segmentSize * game.segmentMultipler * -Math.cos(this.angle);
		this.circle.fillColor = new Color(0, 0.75);
		this.circle.selected = true;
    this.circle.onFrame = (event) => this.onFrame(event);

    this.game.whizzbangs.push(this);
  }

  onFrame(event) {
    //Проверка на проход верхней границы или окончания времени жизни
    if (this.outOfGame() || this.lifetimeExceeded()) {
      this.delete();
      return;
    }

		var speedDelta = this.game.wSpeed * event.delta;
		//Вычисление скоростей поу углу
		this.circle.position.x += speedDelta * Math.sin(this.angle) * this.directionX;
		this.circle.position.y += speedDelta * -Math.cos(this.angle) * this.directionY;

		if (this.outOfWalls()) {
			this.directionX *= -1;
			this.circle.position.x -= (this.circle.position.x - this.game.segmentSize / 2) % this.game.segmentSize;
		}

		var ahtResult = this.game.angleHitTestUtil.hitTestArray(this.circle.position, this.game.victims);
		if (ahtResult.data) {
			if (ahtResult.data.xSide != 0) {
				this.directionX *= -1
			}
			if (ahtResult.data.ySide != 0) {
				this.directionY *= -1
			}
			this.game.damage(ahtResult.item);
		}

		this.livetime += event.delta;
  }

  outOfGame() {
    return this.circle.position.y < 0 ||
           this.circle.position.y >= this.game.height - this.game.segmentSize;
  }

  outOfWalls() {
    return this.circle.position.x - this.game.segmentSize / 2 - 1 <= 0 ||
           this.circle.position.x + this.game.segmentSize / 2 + 1 >= this.game.width;
  }

  lifetimeExceeded() {
    return this.livetime > this.game.wLivetimeLength;
  }

  delete() {
    this.circle.remove();
    var whizzbangs = this.game.whizzbangs;
    whizzbangs.splice(whizzbangs.indexOf(this), 1);
  }
}

export default Whizzbang;
