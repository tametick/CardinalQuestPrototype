var Tile = function(symbol, description){
	return {
		symbol: symbol,
		description: description
	}
}

var Map = function(width, height){
	var tiles = [];
	var creatures = [];
	var creatureMap = [];
	
	// Draw the map around the player
	draw = function(){
		for (var x = 0; x < width; x++) 
			for (var y = 0; y < height; y++) 
				if (creatureMap[[x, y]] == null) 
					viewer.putTile(Settings.ViewerWidth / 2 + x - player.x, Settings.ViewerHeight / 2 + y - player.y, tiles[[x, y]].symbol, [200, 200, 200]);
	}
	stringify = function(){
		tilesStr ="";
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) 
				tilesStr += tiles[[x, y]].symbol;
		}
		
		creaturesStr="";
		for (var c = 0; c<creatures.length; c++)
			creaturesStr +=creatures[c].stringify()+"_";
		
		return [tilesStr,creaturesStr];
	}
	parse = function(string){
		
	}
	
	// Read map
	$.getJSON("json/map.json", function(data){
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) 
				if (data[y].charAt(x) == '#') 
					tiles[[x, y]] = Tile('#', Descriptions.Wall);
				else if (data[y].charAt(x) == '+') 
					tiles[[x, y]] = Tile('+', Descriptions.Door);
				else 
					tiles[[x, y]] = Tile('.', null);
		}
		
		// Insert player
		creatures[0] = player;
		creatureMap[[player.x, player.y]] = player;
	});
	
	return {
		width: width,
		height: height,
		tiles: tiles,
		draw: draw,
		creatureMap: creatureMap,
		stringify: stringify,
		parse: parse
	}
}
