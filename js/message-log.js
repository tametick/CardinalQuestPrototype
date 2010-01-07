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
		for (var i = max; i >= min; i--) 
			log.append(vars.data[i] + "<br>");
		
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
