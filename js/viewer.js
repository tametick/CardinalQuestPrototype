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
	var putTile = function(x, y, id, symbol, color){
		if(symbol=='@'){
			if(player.charClassId == "@f")
				canvas.context.drawImage(Pics.player, 0, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
			else if(player.charClassId == "@w")
				canvas.context.drawImage(Pics.player, canvas.tileSize, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
			else if(player.charClassId == "@t")
				canvas.context.drawImage(Pics.player, canvas.tileSize*2, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol==".") {
			canvas.context.drawImage(Pics.tiles, canvas.tileSize*5, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol=="#1") {
			canvas.context.drawImage(Pics.tiles, canvas.tileSize*11, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol=="#2") {
			canvas.context.drawImage(Pics.tiles, canvas.tileSize*13, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol=="#3") {
			canvas.context.drawImage(Pics.tiles, canvas.tileSize*15, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol=="#4") {
			canvas.context.drawImage(Pics.tiles, canvas.tileSize*17, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol=="+") {
			canvas.context.drawImage(Pics.tiles, canvas.tileSize*19, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);			
		} else if(symbol=="'") {
			canvas.context.drawImage(Pics.tiles, canvas.tileSize*21, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);			
		} else if(id=="sh"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*5, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="clc"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*4, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="ee"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*6, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="eh"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*8, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="el"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*7, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="be"){
			canvas.context.drawImage(Pics.items, canvas.tileSize, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="hs"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*9, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="la"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*2, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="bp"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*3, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="row"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*7, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="aoe"){
			canvas.context.drawImage(Pics.items, 0, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="coe"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*6, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="hoh"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*9, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="god"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*5, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="ab"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*8, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="ss"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*2, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="ls"){
			canvas.context.drawImage(Pics.items, canvas.tileSize*3, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="s"){
			canvas.context.drawImage(Pics.items, 0, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="d"){
			canvas.context.drawImage(Pics.items, canvas.tileSize, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else {	
			canvas.context.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
			canvas.context.fillText(symbol, x * canvas.tileSize, y * canvas.tileSize);
		}
	}
	var print = function(x, y, str, color){
		canvas.context.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
		canvas.context.fillText(str, x * canvas.fontWidth, y * canvas.fontHeight);
	}

	var putShadow = function( x, y, opacity ) {
		var dx = x * canvas.tileSize;
		var dy = (y-1) * canvas.tileSize;
		canvas.context.fillStyle = "rgba(0,0,0,+"+opacity+")";
		canvas.context.fillRect( dx, dy, canvas.tileSize, canvas.tileSize );
	}

	canvas = Canvas();
	
	return {
		width: width,
		height: height,
		center: center,
		clear: clear,
		putTile: putTile,
		print: print,
		putShadow: putShadow
	}
}

