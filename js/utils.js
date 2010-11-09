/* 
 * Cardinal Quest
 * http://www.tametick.com/cq/
 *
 * Copyright (C) 2010, Ido Yehieli
 * Released under the GPL License:
 * http://www.gnu.org/licenses/gpl.txt
 */
 
 
 var Utils = function(){
	String.prototype.startsWith = function(t, i) {
		if (i==false)
			return (t == this.substring(0, t.length));
		else
			return (t.toLowerCase()	== this.substring(0, t.length).toLowerCase());
	}
	String.prototype.endsWith = function(t, i) {
		if (i==false)
			return (t == this.substring(this.length - t.length));
		else
			return (t.toLowerCase() == this.substring(this.length - t.length).toLowerCase());
	}

	var initFromType = function(vars, type){
		for (var property in type) 
			if (isNaN(type[property])) 
				vars[property] = type[property];
			else 
				vars[property] = type[property] * 1;
	}
	var alphanumeric = function alphanumeric(hh){
		if ((hh > 47 && hh < 58) || (hh > 64 && hh < 91) || (hh > 96 && hh < 123)) 
			return String.fromCharCode(hh);
		else 
			return "";
	}
	var capitalize = function(str){
		return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
	}
	var randInt = function(min, max){
		return min + Math.floor(Math.random() * (max - min + 1));
	}
	var inRange = function(x0, y0, x1, y1){
		return Math.abs(y1 - y0) + Math.abs(x1 - x0) < 5;
	}
	var dist = function(x1,y1,x2,y2){
		dx = x1-x2;
		dy = y1-y2;
		return Math.sqrt(dx*dx+dy*dy);
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
		alphanumeric: alphanumeric,
		capitalize: capitalize,
		randInt: randInt,
		inRange: inRange,
		dist: dist,
		los: los
	}
}
