var MessageLog = function(){
	var logBuffer = 100;
	var visibleLogBuffer = 3;
	var data = [];
	
	var append = function(toAdd){
		this.data.push(toAdd);
		if (this.data.length > this.logBuffer) 
			this.data.shift();
	}
	
	var renderToHtml = function(){
		var log = $("#messageLog").get();
		
		while (log.hasChildNodes()) 
			log.removeChild(log.childNodes[0]); //fixme
		var max = this.data.length - 1;
		var min = max - this.visibleLogBuffer;
		if (min < 0) 
			min = 0;
		
		for (var i = max; i >= min; i--) {
			var newItem = document.createElement("p"); //fixme
			var newText = document.createTextNode(this.data[i]); //fixme
			newItem.appendChild(newText);
			log.appendChild(newItem);
		}
	}
	
	return {
		append: append,
		renderToHtml: renderToHtml
	}
}
