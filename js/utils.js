var Utils = function(){
	initFromType = function(vars, type){
		for (var property in type) 
			if (isNaN(type[property])) 
				vars[property] = type[property];
			else 
				vars[property] = type[property] * 1;
	}
	
	var randInt = function(min, max){
		return min + Math.floor(Math.random() * (max - min + 1));
	}
	var inRange = function(x0, y0, x1, y1){
		return Math.abs(y1 - y0) + Math.abs(x1 - x0) < 5;
	}
	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function(from, to){
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	}
	
	var los = function(x0, y0, x1, y1, opaque, apply){
		var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
		if (steep) {
			var t = y0;
			y0 = x0;
			x0 = t;
			t = y1;
			y1 = x1;
			x1 = t;
		}
		if (x0 > x1) {
			var t = x1;
			x1 = x0;
			x0 = t;
			t = y1;
			y1 = y0;
			y0 = t;
		}
		var err_num = 0.0;
		var y = y0;
		for (var x = x0; x <= x1; x++) {
			if (x > x0 && x < x1) 
				if (steep) {
					if (opaque && opaque(y, x)) 
						return false;
					else if (apply) 
						apply(y, x);
				} else if (opaque && opaque(x, y)) 
					return false;
				else if (apply) 
					apply(x, y);
			
			err_num += Math.abs(y1 - y0) / (x1 - x0);
			if (0.5 < Math.abs(err_num)) {
				y += y1 > y0 ? 1 : -1;
				err_num--;
			}
		}
		return true;
	}
	
	return {
		initFromType: initFromType,
		randInt: randInt,
		inRange: inRange,
		los: los
	}
}
