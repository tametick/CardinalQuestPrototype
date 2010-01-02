var MessageLog = function(){
	var logBuffer = 100;
	var visibleLogBuffer = 3;
	var data = [];
	
	var append = function(toAdd){
		data.push(toAdd);
		if (data.length > logBuffer) 
			data.shift();
	}	
	var print = function(){
		var log = $("#messageLog");
		var max = data.length - 1;
		var min = Math.max(0, max - visibleLogBuffer);
		
		log.empty();
		for (var i = max; i >= min; i--) 
			log.append("<br>" + data[i]);
	}
	
	return {
		append: append,
		print: print
	}
}
