/* Width & height are in characters. */
var Viewer = function(width, height){
	var canvas;
	var center = [width / 2, height / 2];
	
	var Canvas = function(){
		var mapCanvasElement;
		var mapContext;
		var lightingCanvasElement;
		var lightingContext;
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
			lightingCanvasElement.height =  mapCanvasElement.height = fontHeight * height;
			lightingCanvasElement.width = mapCanvasElement.width = fontWidth * width;
			mapContext.font = to;
		}
		
		mapCanvasElement = $("#viewer").get()[0];
		mapContext = mapCanvasElement.getContext("2d");
		lightingCanvasElement = $("#lighting").get()[0];
		lightingContext = lightingCanvasElement.getContext("2d");
		changeFont("32px monospace");
		tileSize= 32;
		
		return {
			mapCanvasElement: mapCanvasElement,
			lightingCanvasElement: lightingCanvasElement,
			mapContext: mapContext,
			lightingContext: lightingContext,
			fontHeight: fontHeight,
			fontWidth: fontWidth,
			tileSize: tileSize
		}
	}

	var clearEffect = function(x,y,width,height) {
		var clearImageData = canvas.lightingContext.createImageData(width,height);
		canvas.lightingContext.putImageData(clearImageData, x, y);
	}

	var fireNovaEffect = function(r) {
		var x = canvas.tileSize*(width / 2 );
		var y = canvas.tileSize*(height / 2 -1);

		var hitGradient = canvas.lightingContext.createRadialGradient(x+canvas.tileSize/2, y+canvas.tileSize/2, 1,
			x+canvas.tileSize/2, y+canvas.tileSize/2, r*canvas.tileSize);
			
		hitGradient.addColorStop(0, 'rgba(255,0,0,1)');
		hitGradient.addColorStop(1, 'rgba(255,0,0,0)');

		canvas.lightingContext.fillStyle = hitGradient;

		canvas.lightingContext.fillRect(x-r*canvas.tileSize, y-r*canvas.tileSize, r*2*canvas.tileSize, r*2*canvas.tileSize);
		setTimeout("viewer.clearEffect("+(x-r*canvas.tileSize)+","+(y-r*canvas.tileSize)+","+(r*2*canvas.tileSize)+","+(r*2*canvas.tileSize)+")", 250);
	}

	var hitEffect = function(dx,dy) {
		var x = canvas.tileSize*(width / 2 + dx);
		var y = canvas.tileSize*(height / 2 + dy-1);
		var e = utils.randInt(0,1);
		
		canvas.lightingContext.drawImage(Pics.effects, canvas.tileSize*e, 0, canvas.tileSize, canvas.tileSize, x , y, canvas.tileSize ,canvas.tileSize);

		setTimeout("viewer.clearEffect("+x+","+y+","+canvas.tileSize+","+canvas.tileSize+")", 250);
	}

	var _aura = function(c1, c2) {
		var x = canvas.tileSize*width/2;
		var y = canvas.tileSize*(height/2-1) ;

		var hitGradient = canvas.mapContext.createRadialGradient(x+canvas.tileSize/2, y+canvas.tileSize/2, canvas.tileSize/3,
			x+canvas.tileSize/2, y+canvas.tileSize/2, canvas.tileSize);
		hitGradient.addColorStop(0, c1);
		hitGradient.addColorStop(1, c2);
		
		canvas.mapContext.fillStyle = hitGradient;

		canvas.mapContext.fillRect(x, y, canvas.tileSize, canvas.tileSize);
	}

	var _berserkAura = function(){
		_aura('rgba(128,0,0,0)','rgba(255,0,0,1)');
	}
	var _shadowWalkAura= function(){
		_aura('rgba(0,0,128,0)','rgba(0,0,128,1)');
	}

	var _clear = function(context, color){
		context.fillStyle = color;
		context.fillRect(0, 0, canvas.mapCanvasElement.width, canvas.mapCanvasElement.height);
	}

	var clear = function() {
		_clear(canvas.mapContext, "rgb(0, 0, 0)");
	}

	var clearLighting = function() {
		_clear(canvas.lightingContext, "rgba(0,0,0,0)");
	}

	var putTile = function(x, y, id, symbol, color){
		var monsterRow = symbol.substring(symbol.length-1)*1;

		if(symbol=='@'){
			var weaponUsed= player.vars.weapon.wielded[0];
			var weaponLine;
			if(!weaponUsed)
				weaponLine = 0;
			else if(weaponUsed.id=="d")
				weaponLine = 4;
			else if(weaponUsed.id=="ss")
				weaponLine = 2;
			else if(weaponUsed.id=="ls")
				weaponLine = 1;
			else if(weaponUsed.id=="s")
				weaponLine = 3;
				
			if(player.charClassId == "@f"){
				canvas.mapContext.drawImage(Pics.player, 0, canvas.tileSize*weaponLine, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
				if(player.vars.aura)
					_berserkAura();
			} else if(player.charClassId == "@w") {
				canvas.mapContext.drawImage(Pics.player, canvas.tileSize, canvas.tileSize*weaponLine, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
			} else if(player.charClassId == "@t") {
				if(player.vars.aura)
					_shadowWalkAura();
				else
					canvas.mapContext.drawImage(Pics.player, canvas.tileSize*2, canvas.tileSize*weaponLine, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
				
			}
		} else if(symbol.startsWith("k")) {
			canvas.mapContext.drawImage(Pics.monsters, canvas.tileSize*monsterRow, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol.startsWith("W")) {
			canvas.mapContext.drawImage(Pics.monsters, canvas.tileSize*monsterRow, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol.startsWith("b")) {
			canvas.mapContext.drawImage(Pics.monsters, canvas.tileSize*monsterRow, canvas.tileSize*2, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol.startsWith("M")) {
			canvas.mapContext.drawImage(Pics.monsters, canvas.tileSize*monsterRow, canvas.tileSize*3, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol.startsWith("su")) {
			canvas.mapContext.drawImage(Pics.monsters, canvas.tileSize*monsterRow, canvas.tileSize*4, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol.startsWith("S")) {
			canvas.mapContext.drawImage(Pics.monsters, canvas.tileSize*monsterRow, canvas.tileSize*5, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol==".") {
			canvas.mapContext.drawImage(Pics.tiles, canvas.tileSize*5, canvas.tileSize+Math.floor(currentMap/4)*canvas.tileSize*2, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol==">") {
			canvas.mapContext.drawImage(Pics.tiles, canvas.tileSize*3, canvas.tileSize+Math.floor(currentMap/4)*canvas.tileSize*2, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol=="#1") {
			canvas.mapContext.drawImage(Pics.tiles, canvas.tileSize*11, canvas.tileSize+Math.floor(currentMap/4)*canvas.tileSize*2, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol=="#2") {
			canvas.mapContext.drawImage(Pics.tiles, canvas.tileSize*13, canvas.tileSize+Math.floor(currentMap/4)*canvas.tileSize*2, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol=="#3") {
			canvas.mapContext.drawImage(Pics.tiles, canvas.tileSize*15, canvas.tileSize+Math.floor(currentMap/4)*canvas.tileSize*2, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol=="#4") {
			canvas.mapContext.drawImage(Pics.tiles, canvas.tileSize*17, canvas.tileSize+Math.floor(currentMap/4)*canvas.tileSize*2, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol=="+") {
			canvas.mapContext.drawImage(Pics.tiles, canvas.tileSize*19, canvas.tileSize+Math.floor(currentMap/4)*canvas.tileSize*2, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(symbol=="'") {
			canvas.mapContext.drawImage(Pics.tiles, canvas.tileSize*21, canvas.tileSize+Math.floor(currentMap/4)*canvas.tileSize*2, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="sh"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*5, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="clc"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*4, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="ee"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*6, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="eh"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*8, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="el"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*7, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="be"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="hs"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*9, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="la"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*2, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="bp"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*3, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="row"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*7, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="aoe"){
			canvas.mapContext.drawImage(Pics.items, 0, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="coe"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*6, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="hoh"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*9, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="god"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*5, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="ab"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*8, 0, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="ss"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*2, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="ls"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize*3, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="s"){
			canvas.mapContext.drawImage(Pics.items, 0, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else if(id=="d"){
			canvas.mapContext.drawImage(Pics.items, canvas.tileSize, canvas.tileSize, canvas.tileSize, canvas.tileSize, x * canvas.tileSize, (y-1) * canvas.tileSize, canvas.tileSize ,canvas.tileSize);
		} else {	
			canvas.mapContext.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
			canvas.mapContext.fillText(symbol, x * canvas.tileSize, y * canvas.tileSize);
		}
	}
	var print = function(x, y, str, color){
		canvas.mapContext.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
		canvas.mapContext.fillText(str, x * canvas.fontWidth, y * canvas.fontHeight);
	}

	var putShadow = function( x, y, opacity ) {
		var dx = x * canvas.tileSize;
		var dy = (y-1) * canvas.tileSize;
		canvas.mapContext.fillStyle = "rgba(0,0,0,+"+opacity+")";
		canvas.mapContext.fillRect( dx, dy, canvas.tileSize, canvas.tileSize );
	}

	canvas = Canvas();
	
	return {
		width: width,
		height: height,
		center: center,
		clear: clear,
		clearLighting: clearLighting,
		putTile: putTile,
		print: print,
		putShadow: putShadow,
		hitEffect: hitEffect,
		fireNovaEffect: fireNovaEffect,
		clearEffect :clearEffect 
	}
}

