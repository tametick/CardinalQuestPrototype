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
	var draw = function(){
		for (var y = 0; y < height; y++) 
			for (var x = 0; x < width; x++) 
				if (this.creatureMap[[x, y]] == null) 
					viewer.putTile(Settings.ViewerWidth / 2 + x - player.x, Settings.ViewerHeight / 2 + y - player.y, tiles[[x, y]].symbol, [200, 200, 200]);
	}
	var stringify = function(){
		tilesStr = "";
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) 
				tilesStr += tiles[[x, y]].symbol;
		}
		
		var creaturesStr = "";
		for (var c = 0; c < this.creatures.length; c++) 
			creaturesStr += this.creatures[c].stringify() + "_";
		
		return [tilesStr, creaturesStr];
	}
	var parse = function(tilesStr, creaturesStr){
		for (var y = 0; y < height; y++) 
			for (var x = 0; x < width; x++) {
				currentChar = tilesStr.charAt(width * y + x);
				if (currentChar == '#') 
					tiles[[x, y]] = Tile('#', Descriptions.Wall);
				else if (currentChar == '+') 
					tiles[[x, y]] = Tile('+', Descriptions.Door);
				else if (currentChar == "'") 
					tiles[[x, y]] = Tile("'", Descriptions.OpenDoor);
				else 
					tiles[[x, y]] = Tile('.', null);
			}
		
		this.creatures = [];
		this.creatureMap = [];
		var creaturesArray = creaturesStr.split("_");
		for (var c = 0; c < creaturesArray.length - 1; c++) {
			parsedCreature = creaturesArray[c].split(",");
			this.creatures[c] = Creature(parsedCreature[0] * 1, parsedCreature[1] * 1, parsedCreature[2], Descriptions.Player);
			this.creatureMap[[this.creatures[c].x, this.creatures[c].y]] = this.creatures[c];
		}
	}
	var generate = function(){
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
	}
	
	return {
		width: width,
		height: height,
		tiles: tiles,
		draw: draw,
		creatures: creatures,
		creatureMap: creatureMap,
		stringify: stringify,
		parse: parse,
		generate: generate
	}
}
