var scr;

$(document).ready(function(){
	scr = Screen(20, 10);
	scr.putCell(0, 0, "Hello canvas world!", [240, 240, 240]);
	
});

var Screen = function(width, height){
	var canvas = Canvas('screen', width, height);
	
	var clearAll = function(){
		canvas.ctx.fillStyle = "rgb(0, 0, 0)";
		canvas.ctx.fillRect(0, 0, canvas.canvasElement.width, canvas.canvasElement.height);
	}
	var putCell = function(x, y, symbol, color){
		canvas.ctx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
		canvas.ctx.fillText(symbol, x * canvas.fontWidth(), (y * canvas.fontHeight()) + canvas.fontDescent());
	}
	clearAll();
	putCell(0, 1, canvas.canvasElement.width, [240, 240, 240]);
	putCell(0, 2, canvas.canvasElement.height, [240, 240, 240]);
	
	return {
		width: width,
		height: height,
		clearAll: clearAll,
		putCell: putCell,
	};
}

/* Width & height are in characters. 
 * This class should only be used within GameScreen. */
var Canvas = function(id, width, height){
	var ctx;
	var fascent;
	var fdescent;
	var fwidth;
	
	// Initialize
	var canvasElement = document.getElementById(id);
	if (!canvasElement || !canvasElement.getContext) 
		return null;
	ctx = canvasElement.getContext('2d');
	
	// Gets the font size from a string like "10px monospace"
	var getFontSize = function(str){
		if (!str) 
			return 10;
		if (str.indexOf('px') != -1) {
			return 1 * str.substring(0, str.indexOf('px'));
		} else if (str.indexOf('pt') != -1) {
			return 1 * str.substring(0, str.indexOf('px'));
		} else {
			// default to 10
			return 10;
		}
	}
	
	var changeFont = function(to){
		size = getFontSize(to);
		fascent = size * 0.1;
		fdescent = size;
		fwidth = size;
		canvasElement.width = (fwidth * width);
		canvasElement.height = (fascent + fdescent) * height;
		ctx.font = to;
	}
	
	changeFont('14px monospace');
	
	var fontAscent = function(){
		return fascent;
	}
	var fontDescent = function(){
		return fdescent;
	}
	var fontWidth = function(){
		return fwidth;
	}
	var fontHeight = function(){
		return fascent + fdescent;
	}
	
	
	
	return {
		canvasElement: canvasElement,
		ctx: ctx,
		
		changeFont: changeFont,
		fontAscent: fontAscent,
		fontDescent: fontDescent,
		fontWidth: fontWidth,
		fontHeight: fontHeight,
	};
}
