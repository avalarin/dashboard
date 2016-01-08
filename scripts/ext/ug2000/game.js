import 'paper';
import AngleHitTestUtil from 'ext/ug2000/angleHittestUtil';
import HitTestUtil from 'ext/ug2000/hittestUtil';
import Hunter from 'ext/ug2000/hunter';
import Victim from 'ext/ug2000/victim';
import Whizzbang from 'ext/ug2000/whizzbang';

class Game {

  constructor() {
    //Game size
		this.width = 800;
		this.height = 600;

		//Level
		this.currentLevel = 1; //current-start level
		this.maxLevel = 50;
		this.levelUpSec = 10000;

		//Segment
		this.segmentSize = 25;
		this.segmentMultipler = 4;
		this.minSegmentMultipler = 2;

		//Victims per second
		this.vps = 1.20;
		this.vpsAcc = 0.15;

		//Victims speed
		this.speed = 50;
		this.speedAcc = 10;

		//Whizzbang speed
		this.wps = 10; //Снярядов в секунду
		this.wpsAcc = 0;
		this.wSpeed = 1000;
		this.wLivetimeLength = 1;
		this.damageValue = 1;

		//Hunter
		this.maxGunAngle = 1.3;
		this.minGunAngle = -1.3;

    this.angleHitTestUtil = new AngleHitTestUtil(this);
    this.whizzbangs = [];
    this.victims = [];

    this.victimsCounter = 0;
    this.shotStepCounter = 1;
    this.atomSec = 1;
  }

  begin(readyCallback) {
    paper.install(window);
    paper.setup('canvas');
		view.viewSize = new Size(window.innerWidth, window.innerHeight);
		view.draw();

    this.hitTestUtil = new HitTestUtil(this);
    this.hunter = new Hunter(this);

    //Группа игры
    this.group = new Group();
    this.group.transformContent = false;
    this.group.clipped = true;

    //Маска для компонентов
		var tempRect = new Path.Rectangle(-1, -1, this.width + 2, this.height + 2);
		this.group.addChild(tempRect);

    //Рамка
		var borderRect = Path.Rectangle(0, 0, this.width, this.height - 1);
		borderRect.strokeColor = 'black';
		this.group.addChild(borderRect);

    //Группа жертв
    this.victimsGroup = new Group();
    this.victimsGroup.transformContent = false;
    this.victimsGroup.onFrame = (event) => this.onFrame(event);

    //Добавляем игровые компоненты
		this.group.addChild(this.hunter.group);
		this.group.addChild(this.victimsGroup);

    //Размещение игры по центру канваса
		this.group.position = view.center;

    //Установка параметров начального уровня
		this.applyLevelParams();

    readyCallback();

    //Увиличение уровня
		var interval = setInterval(() => {
			if (this.currentLevel >= this.maxLevel) {
				clearInterval(interval);
				return;
			}
      this.currentLevel++;
      this.applyLevelParams();
		}, this.levelUpSec);
  }

  onFrame(event) {
    if (this.atomSec >= 1 / this.vps) {
			var victim = new Victim(this);
			this.victimsGroup.addChild(victim.group);
			this.victims.push(victim);
			victim.group.onDestruct = (event) => {
				this.victims.splice(this.victims.indexOf(event.item), 1);
				}
			this.atomSec = 0;
		}
		this.atomSec += event.delta;
  }

  applyLevelParams() {
			this.vps += this.vpsAcc * (this.currentLevel - 1);
			this.speed += this.speedAcc * (this.currentLevel - 1);
			this.wps += this.wpsAcc * (this.currentLevel - 1);

			console.log("LEVEL " + this.currentLevel);
			console.log("vps " + this.vps);
			console.log("wps " + this.wps);
			console.log("speed " + this.speed);
			console.log("");
	}

  createWhizzbang(angle) {
    return new Whizzbang(this, angle);
  }

  damage(victim) {
    var lifeDelta = this.damageValue * victim.life / victim.points;
		victim.life -= lifeDelta;
		victim.points -= this.damageValue;

		if (victim.points <= 0) {
			this.victims.splice(this.victims.indexOf(victim), 1);
			victim.remove();
		} else {
			victim.setColorAlpha(victim.life * 0.5);
		}
  }

  //Выстрелы
	startShoting() {
		this.hunter.group.onFrame = (event) => {
			if (this.shotStepCounter >= 1 / this.wps) {
				this.hunter.shot();
				this.shotStepCounter = 0;
			}
			this.shotStepCounter += event.delta;
		}
	}

	//Остановка череды выстрелов
	stopShoting(event) {
		this.hunter.group.onFrame = (event) => {
			if (this.shotStepCounter >= 1 / this.wps) {
				this.shotStepCounter = 1;
				this.hunter.group.onFrame = undefined;
			}
			this.shotStepCounter += event.delta;
		}
	}

  setTargetPosition(x, y) {
		var angle = Math.atan2(x - this.width / 2, (this.height - this.segmentSize) - y);
		this.setTargetAngle(angle);
	}

  setTargetAngle(angle) {
		angle = Math.max(Math.min(angle, this.maxGunAngle), this.minGunAngle)
    this.hunter.setDirectionByAngle(angle);
	}

}

export default Game;
