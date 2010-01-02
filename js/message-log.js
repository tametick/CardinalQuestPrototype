var MessageLog = function(){
	var log = $("#messageLog");
	var logBuffer = 100;
	var visibleLogBuffer = 3;
	var data = [];
	
	var clear = function(){
		data = [];
	}
	var append = function(toAdd){
		data.push(toAdd);
		if (data.length > logBuffer) 
			data.shift();
	}
	var print = function(){
		var max = data.length - 1;
		var min = Math.max(0, max - visibleLogBuffer);
		
		log.empty();
		for (var i = max; i >= min; i--) 
			log.append(data[i] + "<br>");
	}
	
	return {
		clear: clear,
		append: append,
		print: print
	}
}
