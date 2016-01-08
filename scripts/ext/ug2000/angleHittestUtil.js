class AngleHitTestUtil {
  constructor(game) {
    this.game = game;
  }

  hitTestArrays(whizzbangs, victims) {
		var victimsResult = [];
		var whizzbangsResult = [];
		var testResult;
		for (var i = 0; i < whizzbangs.length; i++) {
			testResult = this.hitTestArray(whizzbangs[i].position, victims);
			if (testResult.data) {
				victimsResult.push(testResult);
				whizzbangsResult.push(hizzbangs[i]);
			}
		}
		return [whizzbangsResult, victimsResult];
	}

	hitTestArray(point, victims) {
		var testResult;
		for (var i = victims.length - 1; i >= 0; i--) {
			testResult = this.hitTest(point, victims[i])
			if (testResult.hit) {
				return {data: testResult, item: victims[i]};
			}
		}
		return {data: undefined, item: undefined};
	}

	hitTest(point, victim) {
    var obj = victim.group;
		var correction = this.game.segmentSize / 2 + 0.5;

		var bx0v = obj.position.x - obj.data.hitTestData[0] / 2 - correction;
		var bx1v = obj.position.x + obj.data.hitTestData[0] / 2 + correction;
		var by0v = obj.position.y - obj.data.hitTestData[1] / 2 - correction;
		var by1v = obj.position.y + obj.data.hitTestData[1] / 2 + correction;

		var bx0 = bx0v <= point.x;
		var bx1 = bx1v >= point.x;
		var by0 = by0v <= point.y;
		var by1 = by1v >= point.y;

		var hit = bx0 && bx1 && by0 && by1
		if (hit) {
			var xS0 = this.pointInTriangle(point, obj.position, {x: bx0v, y: by0v}, {x: bx0v, y: by1v});
			var yS0 = this.pointInTriangle(point, obj.position, {x: bx0v, y: by0v}, {x: bx1v, y: by0v});
			var xS1 = this.pointInTriangle(point, obj.position, {x: bx1v, y: by0v}, {x: bx1v, y: by1v});
			var yS1 = this.pointInTriangle(point, obj.position, {x: bx1v, y: by1v}, {x: bx0v, y: by1v});
			var x = xS1 - xS0;
			var y = yS1 - yS0;
		}
		return {hit: hit, xSide: x, ySide: y};
	}

	pointInTriangle(point, tPoint0, tPoint1, tPoint2) {
		var a = 1/2 * (-tPoint1.y * tPoint2.x + tPoint0.y * (-tPoint1.x + tPoint2.x) + tPoint0.x * (tPoint1.y - tPoint2.y) + tPoint1.x * tPoint2.y);
		var sign = a < 0 ? -1 : 1;
		var s = (tPoint0.y * tPoint2.x - tPoint0.x * tPoint2.y + (tPoint2.y - tPoint0.y) * point.x + (tPoint0.x - tPoint2.x) * point.y) * sign;
		var t = (tPoint0.x * tPoint1.y - tPoint0.y * tPoint1.x + (tPoint0.y - tPoint1.y) * point.x + (tPoint1.x - tPoint0.x) * point.y) * sign;

		return s > 0 && t > 0 && (s + t) < 2 * a * sign;
	}

}

export default AngleHitTestUtil;
