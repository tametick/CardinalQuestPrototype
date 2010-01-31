/* Width & height are in characters. */
var Viewer = function(width, height){
	var canvas;
	var center = [width / 2, height / 2];
	var playerImg = new Image();
	playerImg.src = 'pics/chars.png';
	var tilesImg = new Image();
	tilesImg.src = '../pics/tiles-big.png';
	
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
		changeFont("32px monospace");
		tileSize= 32;
		
		return {
			canvasElement: canvasElement,
			context: context,
			fontHeight: fontHeight,
			fontWidth: fontWidth,
			tileSize: tileSize,
		}
	}
	var clear = function(){
		canvas.context.fillStyle = "rgb(0, 0, 0)";
		canvas.context.fillRect(0, 0, canvas.canvasElement.width, canvas.canvasElement.height);
	}
	var putTile = function(x, y, symbol, color){
		if(symbol=='@'){
			if(player.charClassId == "@f")
				canvas.context.drawImage(playerImg, 0, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
			else if(player.charClassId == "@t")
				canvas.context.drawImage(playerImg, canvas.tileSize, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
			else if(player.charClassId == "@w")
				canvas.context.drawImage(playerImg, canvas.tileSize*2, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else {
			canvas.context.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
			canvas.context.fillText(symbol, x * canvas.tileSize, y * canvas.tileSize);
		}
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

