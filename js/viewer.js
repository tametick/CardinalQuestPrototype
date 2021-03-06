/* 
 * Cardinal Quest
 * http://www.tametick.com/cq/
 *
 * Copyright (C) 2010, Ido Yehieli
 * Released under the GPL License:
 * http://www.gnu.org/licenses/gpl.txt
 */
 
 
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
		};
		var changeFont = function(to){
			fontHeight = getFontSize(to);
			fontWidth = fontHeight;
			lightingCanvasElement.height =  mapCanvasElement.height = fontHeight * height;
			lightingCanvasElement.width = mapCanvasElement.width = fontWidth * width;
			mapContext.font = to;
		};
		
		mapCanvasElement = $("#viewer").get()[0];
		mapContext = mapCanvasElement.getContext("2d");
		lightingCanvasElement = $("#lighting").get()[0];
		lightingContext = lightingCanvasElement.getContext("2d");
		changeFont("32px monospace");
		fontHeight = 24;
		fontWidth = 24;
		tileSize= 32;
		
		return {
			mapCanvasElement: mapCanvasElement,
			lightingCanvasElement: lightingCanvasElement,
			mapContext: mapContext,
			lightingContext: lightingContext,
			fontHeight: fontHeight,
			fontWidth: fontWidth,
			tileSize: tileSize
		};
	};

	var clearEffect = function(x,y,width,height) {
		var clearImageData = canvas.lightingContext.createImageData(width,height);
		canvas.lightingContext.putImageData(clearImageData, x, y);
	};

	var fireNovaEffect = function(r) {
		var x = canvas.tileSize*(width / 2 );
		var y = canvas.tileSize*(height / 2 -1);

		var hitGradient = canvas.lightingContext.createRadialGradient(x+canvas.tileSize/2, y+canvas.tileSize/2, 1,
			x+canvas.tileSize/2, y+canvas.tileSize/2, r*canvas.tileSize);
			
		hitGradient.addColorStop(0, 'rgba(255,0,0,1)');
		hitGradient.addColorStop(1, 'rgba(255,0,0,0)');

		canvas.lightingContext.fillStyle = hitGradient;

		canvas.lightingContext.fillRect(x-r*canvas.tileSize, y-r*canvas.tileSize, r*2*canvas.tileSize, r*2*canvas.tileSize);

		var clearFunc = function() {
			var pxRadius = canvas.tileSize * r;
			viewer.clearEffect(x - pxRadius, y - pxRadius, 2 * pxRadius, 2 * pxRadius);
		};
		setTimeout(clearFunc, 250);
	};

	var hitEffect = function(dx,dy) {
		var x = (width / 2) + dx;
		var y = (height / 2) + dy;
		var e = utils.randInt(0,1);
		
		drawSymbol(x, y, "effects", "slash", e, "lightingContext");

		var clearFunc = function() {
			var size = canvas.tileSize;
			viewer.clearEffect(size * x, size * (y - 1), size, size);
		};
		setTimeout(clearFunc, 250);
	};

	var _visibleEffect = function(c1, c2) {
		var x = canvas.tileSize*width/2;
		var y = canvas.tileSize*(height/2-1) ;

		var hitGradient = canvas.mapContext.createRadialGradient(x+canvas.tileSize/2, y+canvas.tileSize/2, canvas.tileSize/3,
			x+canvas.tileSize/2, y+canvas.tileSize/2, canvas.tileSize);
		hitGradient.addColorStop(0, c1);
		hitGradient.addColorStop(1, c2);
		
		canvas.mapContext.fillStyle = hitGradient;

		canvas.mapContext.fillRect(x, y, canvas.tileSize, canvas.tileSize);
	}
	/*
	var _berserkVisibleEffect = function(){
		_visibleEffect('rgba(128,0,0,0)','rgba(255,0,0,1)');
	}
	var _shadowWalkVisibleEffect= function(){
		_visibleEffect('rgba(0,0,128,0)','rgba(0,0,128,1)');
	}*/

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

	var putCorpse = function(x, y, corpse) {
		drawSymbol(x, y, "corpses", "corpse", corpse);
	}

	var drawSymbol = function(x, y, type, symbol, variant, context) {
		canvas[context ? context : "mapContext"].drawImage(
			Sprites[type].image,
			Sprites[type].tileWidth * Sprites[type].tiles[symbol][variant].x,
			Sprites[type].tileHeight * Sprites[type].tiles[symbol][variant].y,
			Sprites[type].tileWidth,
			Sprites[type].tileHeight,
			canvas.tileSize * x,
			canvas.tileSize * (y - 1),
			canvas.tileSize,
			canvas.tileSize
		);
	}

	var putTile = function(x, y, id, symbol, color){
		var monsterVariant = symbol.substring(symbol.length-1)*1;

		if(symbol=='@'){
			var weaponUsed= player.vars.weapon.wielded[0];
			var weaponClass;
			if(!weaponUsed) {
				weaponClass = "fists";
			} else if(weaponUsed.id=="d") {
				weaponClass = "dagger";
			} else if(weaponUsed.id=="ss") {
				weaponClass = "shortsword";
			} else if(weaponUsed.id=="ls") {
				weaponClass = "longsword";
			} else if(weaponUsed.id=="s") {
				weaponClass = "staff";
			}
				
			if(player.charClassId == "@f"){
				if(player.vars.visibleEffect == "berserk")
					drawSymbol(x, y, "player", "f-berserk", weaponClass);
				else
					drawSymbol(x, y, "player", "f-normal", weaponClass);
			} else if(player.charClassId == "@w") {
					drawSymbol(x, y, "player", "w-normal", weaponClass);
			} else if(player.charClassId == "@t") {
				if(player.vars.visibleEffect == "shadowwalk")
					drawSymbol(x, y, "player", "t-shadowwalk", weaponClass);
				else
					drawSymbol(x, y, "player", "t-normal", weaponClass);
			}
		} else if(symbol.startsWith("k") || symbol.startsWith("W") || symbol.startsWith("b")
				|| symbol.startsWith("M") || symbol.startsWith("su") || symbol.startsWith("S")) {
			drawSymbol(x, y, "monsters", id, monsterVariant);
		} else if(symbol==">" || symbol=="." || symbol.startsWith("#") || symbol=="+" || symbol=="'") {
			drawSymbol(x, y, "tiles", symbol, Math.floor(currentMap/4));
		} else {
			drawSymbol(x, y, "items", id, 0);
		}
	};
	var print = function(x, y, str, color){
		canvas.mapContext.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
		canvas.mapContext.fillText(str, x * canvas.fontWidth, y * canvas.fontHeight);
	};

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
		putCorpse: putCorpse,
		putTile: putTile,
		print: print,
		putShadow: putShadow,
		hitEffect: hitEffect,
		fireNovaEffect: fireNovaEffect,
		clearEffect: clearEffect ,
		tileSize: canvas.tileSize
	}
}

