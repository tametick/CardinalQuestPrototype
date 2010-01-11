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
		creatureMap: [],
		items: [],
		itemMap: []
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
				if (vars.creatureMap[[x, y]] == null && vars.itemMap[[x, y]] == null) 
					viewer.putTile(Settings.viewerWidth / 2 + x - player.vars.x, Settings.viewerHeight / 2 + y - player.vars.y, tiles[[x, y]].symbol, [200, 200, 200]);
		for (var c = 0; c < vars.items.length; c++) 
			if (vars.creatureMap[[vars.items[c].vars.x, vars.items[c].vars.y]] == null) 
				vars.items[c].draw();
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
		
		var itemsStr = "";
		for (var i = 0; i < vars.items.length; i++) 
			itemsStr += vars.items[i].stringify() + "_";
		
		return [tilesStr, creaturesStr, itemsStr];
	}
	var parse = function(tilesStr, creaturesStr, itemsStr){
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
			vars.creatures[c].vars.spiritPoints = parsedCreature[4] * 1;
			vars.creatures[c].vars.life = parsedCreature[5] * 1;
			if (parsedCreature.length > 6) {
				// Has inventory
				parsedInventory = parsedCreature[6].split(".");
				for (var i = 0; i < parsedInventory[0] * 1; i++) 
					vars.creatures[c].vars.inventory.items.push(Item(0, 0, parsedInventory[i + 1]));
			}
			vars.creatureMap[[vars.creatures[c].vars.x, vars.creatures[c].vars.y]] = vars.creatures[c];
		}
		
		
		vars.items = [];
		vars.itemMap = [];
		var itemsArray = itemsStr.split("_");
		for (var i = 0; i < itemsArray.length - 1; i++) {
			parsedItem = itemsArray[i].split(",");
			
			vars.items[i] = Item(parsedItem[0] * 1, parsedItem[1] * 1, parsedItem[2]);
			vars.items[i];
			vars.itemMap[[vars.items[i].vars.x, vars.items[i].vars.y]] = vars.items[i];
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
		
		// Generate items
		vars.items.push(Item(2, 5, "!"));
		vars.items.push(Item(5, 5, "["));
		vars.items.push(Item(10, 7, "("));
		
		for (var i = 0; i < vars.items.length; i++) {
			vars.items[i].init();
			vars.itemMap[[vars.items[i].vars.x, vars.items[i].vars.y]] = vars.items[i];
		}
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
