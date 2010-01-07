var Tile = function(symbol, description){
	return {
		symbol: symbol,
		description: description
	}
}

var Map = function(width, height){
	var tiles = []
	var vars = {
		creatures: [],
		creatureMap: []
	}
	
	var tick = function(){
		for (var c = 0; c < vars.creatures.length; c++) {
			// Charge action & spirit points
			vars.creatures[c].vars.actionPoints += vars.creatures[c].vars.speed;
			if (vars.creatures[c].vars.spirit) 
				vars.creatures[c].vars.spiritPoints = Math.min(360, vars.creatures[c].vars.spiritPoints + vars.creatures[c].vars.spirit);
			
			// Move if charged
			if (c != 0 && vars.creatures[c].vars.actionPoints >= 60) {
				if (vars.creatures[c].act()) 
					vars.creatures[c].vars.actionPoints = 0;
			}
		}
	}
	var draw = function(){
		for (var y = 0; y < height; y++) 
			for (var x = 0; x < width; x++) 
				if (vars.creatureMap[[x, y]] == null) 
					viewer.putTile(Settings.viewerWidth / 2 + x - player.vars.x, Settings.viewerHeight / 2 + y - player.vars.y, tiles[[x, y]].symbol, [200, 200, 200]);
		for (var c = 0; c < vars.creatures.length; c++) 
			vars.creatures[c].draw();
	}
	var stringify = function(){
		tilesStr = "";
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) 
				tilesStr += tiles[[x, y]].symbol;
		}
		
		var creaturesStr = "";
		for (var c = 0; c < vars.creatures.length; c++) 
			creaturesStr += vars.creatures[c].stringify() + "_";
		
		return [tilesStr, creaturesStr];
	}
	var parse = function(tilesStr, creaturesStr){
		for (var y = 0; y < height; y++) 
			for (var x = 0; x < width; x++) {
				currentChar = tilesStr.charAt(width * y + x);
				if (currentChar == '#') 
					tiles[[x, y]] = Tile('#', Descriptions.wall);
				else if (currentChar == '+') 
					tiles[[x, y]] = Tile('+', Descriptions.door);
				else if (currentChar == "'") 
					tiles[[x, y]] = Tile("'", Descriptions.openDoor);
				else 
					tiles[[x, y]] = Tile('.', null);
			}
		
		vars.creatures = [];
		vars.creatureMap = [];
		var creaturesArray = creaturesStr.split("_");
		for (var c = 0; c < creaturesArray.length - 1; c++) {
			parsedCreature = creaturesArray[c].split(",");
			
			vars.creatures[c] = Creature(parsedCreature[0] * 1, parsedCreature[1] * 1, parsedCreature[2]);
			vars.creatures[c].init();
			vars.creatures[c].vars.actionPoints = parsedCreature[3] * 1;
			vars.creatureMap[[vars.creatures[c].vars.x, vars.creatures[c].vars.y]] = vars.creatures[c];
		}
	}
	var generate = function(data){
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) 
				if (data["tiles"][y].charAt(x) == '#') 
					tiles[[x, y]] = Tile('#', Descriptions.wall);
				else if (data["tiles"][y].charAt(x) == '+') 
					tiles[[x, y]] = Tile('+', Descriptions.door);
				else 
					tiles[[x, y]] = Tile('.', null);
		}
		
		// Insert player
		vars.creatures[0] = player;
		vars.creatureMap[[player.vars.x, player.vars.y]] = player;
		
		// Generate monsters
		vars.creatures[1] = Creature(2, 2, "k");
		vars.creatures[1].init();
		vars.creatureMap[[vars.creatures[1].vars.x, vars.creatures[1].vars.y]] = vars.creatures[1];
		
		vars.creatures[2] = Creature(10, 1, "k");
		vars.creatures[2].init();
		vars.creatureMap[[vars.creatures[2].vars.x, vars.creatures[2].vars.y]] = vars.creatures[2];
	}
	
	return {
		width: width,
		height: height,
		tiles: tiles,
		vars: vars,
		tick: tick,
		draw: draw,
		stringify: stringify,
		parse: parse,
		generate: generate
	}
}
