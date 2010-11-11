/* 
 * Cardinal Quest
 * http://www.tametick.com/cq/
 *
 * Copyright (C) 2010, Ido Yehieli
 * Released under the GPL License:
 * http://www.gnu.org/licenses/gpl.txt
 */
 
 
 var MessageLog = function(){
	var log = $("#messageLog");
	var logBuffer = 100;
	var visibleLogBuffer = Settings.logSize;
	var vars = {
		data: []
	};
	
	var clear = function(){
		vars.data = [];
	}
	var append = function(toAdd){
		vars.data.push(toAdd);
		if (vars.data.length > logBuffer) 
			vars.data.shift();
	}
	var print = function(){
		var max = vars.data.length - 1;
		var min = Math.max(0, max - visibleLogBuffer);
		
		log.empty();
		var opacity = 1.0;
		for (var i = max; i >= min; i--) {
			log.append("<div style='opacity: "+opacity+";'>" + vars.data[i] + "</div>");
			opacity -= 0.20;
		}
		
		// Fill up empty lines to maintain page layout
		for (var i = max + 1; i <= visibleLogBuffer; i++) 
			log.append(" <br>");
	}
	
	return {
		vars: vars,
		clear: clear,
		append: append,
		print: print
	}
}
