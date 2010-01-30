/* Width & height are in characters. */
var Viewer = function(width, height){
	var canvas;
	var center = [width / 2, height / 2];
	
	var Canvas = function(){
		var canvasElement;
		var context;
		var fontHeight;
		var fontWidth;
		var tileSize;
		
		var getFontSize = function(str){
		// Defaults to 10
			if (!str) 
				return 10;
			if (str.indexOf("px") != -1) {
				return 1 * str.substring(0, str.indexOf("px"));
			} else if (str.indexOf("pt") != -1) {
				return 1 * str.substring(0, str.indexOf("px"));
			} else {
				return 10;
			}
		}
		var changeFont = function(to){
			fontHeight = getFontSize(to);
			fontWidth = fontHeight;
			canvasElement.height = fontHeight * height;
			canvasElement.width = fontWidth * width;
			context.font = to;
		}
		
		canvasElement = $("#viewer").get()[0];
		context = canvasElement.getContext("2d");
		changeFont("14px monospace");
		
		return {
			canvasElement: canvasElement,
			context: context,
			fontHeight: fontHeight,
			fontWidth: fontWidth
		}
	}
	var clear = function(){
		canvas.context.fillStyle = "rgb(0, 0, 0)";
		canvas.context.fillRect(0, 0, canvas.canvasElement.width, canvas.canvasElement.height);
	}
	var putTile = function(x, y, symbol, color){
		canvas.context.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
		canvas.context.fillText(symbol, x * canvas.fontWidth, y * canvas.fontHeight);
	}
	var print = function(x, y, str, color){
		canvas.context.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
		canvas.context.fillText(str, x * canvas.fontWidth, y * canvas.fontHeight);
	}
	
	canvas = Canvas();
	
	return {
		width: width,
		height: height,
		center: center,
		clear: clear,
		putTile: putTile,
		print: print
	}
}

