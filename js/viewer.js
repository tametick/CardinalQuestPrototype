/* Width & height are in characters. */
var Viewer = function(width, height){
	var Canvas = function(width, height){
		var canvasElement;
		var context;
		var fontAscent;
		var fontDescent;
		var fontWidth;
		
		// Defaults to 10
		var getFontSize = function(str){
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
			size = getFontSize(to);
			fontAscent = size * 0.1;
			fontDescent = size;
			fontWidth = size;
			canvasElement.width = (fontWidth * width);
			canvasElement.height = (fontAscent + fontDescent) * height;
			context.font = to;
		}
		
		canvasElement = $("#viewer").get()[0];
		context = canvasElement.getContext("2d");
		changeFont("14px monospace");
		
		return {
			canvasElement: canvasElement,
			context: context,
			fontDescent: fontDescent,
			fontAscent: fontAscent,
			fontWidth: fontWidth
		}
	}
	var clear = function(){
		canvas.context.fillStyle = "rgb(0, 0, 0)";
		canvas.context.fillRect(0, 0, canvas.canvasElement.width, canvas.canvasElement.height);
	}
	var putTile = function(x, y, symbol, color){
		canvas.context.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
		canvas.context.fillText(symbol, x * canvas.fontWidth, y * (canvas.fontAscent + canvas.fontDescent) + canvas.fontDescent - 3);
	}
	
	var canvas = Canvas(width, height);
	
	return {
		width: width,
		height: height,
		clear: clear,
		putTile: putTile
	}
}

