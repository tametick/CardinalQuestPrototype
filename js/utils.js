var Utils = function(){
	var randInt = function(min, max){
		return min + Math.floor(Math.random() * (max - min + 1));
	}
	var inRange = function(x0, y0, x1, y1){
		return Math.abs(y1 - y0) + Math.abs(x1 - x0) < 5;
	}
	var line = function(x1, y1, x2, y2, apply){
		var steep = Math.abs(y2 - y1) > Math.abs(x2 - x1);
		if (steep) {
			t = y1;
			y1 = x1;
			x1 = t;
			t = y2;
			y2 = x2;
			x2 = t;
		}
		
		var deltaX = Math.abs(x2 - x1);
		var deltaY = Math.abs(y2 - y1);
		var error = 0;
		var deltaErr = deltaY;
		var xStep;
		var yStep;
		var x = x1;
		var y = y1;
		
		if (x1 < x2) {
			xStep = 1;
		} else {
			xStep = -1;
		}
		if (y1 < y2) {
			yStep = 1;
		} else {
			yStep = -1;
		}
		if (steep) {
			apply(y, x);
		} else {
			apply(x, y);
		}
		
		while (x != x2) {
			x = x + xStep;
			error = error + deltaErr;
			if (2 * error >= deltaX) {
				y = y + yStep;
				error = error - deltaX;
			}
			if (steep) {
				apply(y, x);
			} else {
				apply(x, y);
			}
		}
	}
	
	return {
		randInt: randInt,
		inRange: inRange,
		line: line
	}
}
