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
	
	var tick = function(){
		for (var c = 0; c < creatures.length; c++) {
			// Charge action points
			creatures[c].actionPoints += creatures[c].speed;
			// Move if charged
			if (c != 0 && creatures[c].actionPoints) {
				creatures[c].act();
				creatures[c].actionPoints = 0;
			}
		}
	}
	var draw = function(){
		for (var y = 0; y < height; y++) 
			for (var x = 0; x < width; x++) 
				if (this.creatureMap[[x, y]] == null) 
					viewer.putTile(Settings.ViewerWidth / 2 + x - player.x, Settings.ViewerHeight / 2 + y - player.y, tiles[[x, y]].symbol, [200, 200, 200]);
		for (var c = 0; c < this.creatures.length; c++) 
			this.creatures[c].draw();
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
			this.creatures[c] = Creature(parsedCreature[0] * 1, parsedCreature[1] * 1, 3, parsedCreature[2], Descriptions[parsedCreature[2]]);
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
			
			// Generate monster
			creatures[1] = Creature(2, 2, 3, "k", Descriptions["k"]);
			creatureMap[[creatures[1].x, creatures[1].y]] = creatures[1];
		});
	}
	
	return {
		width: width,
		height: height,
		tiles: tiles,
		tick: tick,
		draw: draw,
		creatures: creatures,
		creatureMap: creatureMap,
		stringify: stringify,
		parse: parse,
		generate: generate
	}
}
