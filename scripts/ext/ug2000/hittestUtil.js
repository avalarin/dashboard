class HitTestUtil {
  constructor(game) {
    this.game = game;
  }

	hitTestArrays(whizzbangs, victims) {
		var victimsResult = [];
		var whizzbangsResult = [];
		var testResult;
		for (var i = 0; i < whizzbangs.length; i++) {
			testResult = this.hitTestArray(whizzbangs[i].position, victims);
			if (testResult.hit) {
				victimsResult.push(testResult);
				whizzbangsResult.push(hizzbangs[i]);
			}
		}
		return [whizzbangsResult, victimsResult];
	}

	hitTestArray(point, victims) {
		for (var i = victims.length - 1; i >= 0; i--) {
			if (this.hitTest(point, victims[i])) {
				return {hit: true, item: victims[i]};
			}
		}
		return {hit: false, item: undefined};
	}

	hitTest(point, obj) {
		var correction = this.game.segmentSize / 2 + 0.5;
		var bx0 = obj.position.x - obj.data.hitTestData[0] / 2 - correction <= point.x;
		var bx1 = obj.position.x + obj.data.hitTestData[0] / 2 + correction >= point.x;
		var by0 = obj.position.y - obj.data.hitTestData[1] / 2 - correction <= point.y;
		var by1 = obj.position.y + obj.data.hitTestData[1] / 2 + correction >= point.y;

		return bx0 && bx1 && by0 && by1;
	}
}

export default HitTestUtil;
