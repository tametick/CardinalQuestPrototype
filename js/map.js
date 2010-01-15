var Room = function(x0, y0, x1, y1){
	return {
		x0: x0,
		y0: y0,
		x1: x1,
		y1: y1,
		w: x1 - x0,
		h: y1 - y0
	}
}

var Tile = function(symbol, description){
	return {
		symbol: symbol,
		description: description
	}
}

var Map = function(width, height){
	var tiles = [];
	var rooms = [];
	var rawData = [];
	var vars = {
		creatures: [],
		creatureMap: [],
		items: [],
		itemMap: []
	}
	
	var tick = function(){
		for (var c = 0; c < vars.creatures.length; c++) {
			// Apply speed buffs
			var speed = vars.creatures[c].vars.speed;
			if (vars.creatures[c].vars.buffs && vars.creatures[c].vars.buffs.speed) 
				speed += vars.creatures[c].vars.buffs.speed;
			// TODO: apply spirit buffs
			var spirit = vars.creatures[c].vars.spirit;
			if (spirit && vars.creatures[c].vars.buffs && vars.creatures[c].vars.buffs.spirit) 
				spirit += vars.creatures[c].vars.buffs.spirit;
			
			// Charge action & spirit points				
			vars.creatures[c].vars.actionPoints += speed;
			if (spirit) 
				vars.creatures[c].vars.spiritPoints = Math.min(360, vars.creatures[c].vars.spiritPoints + spirit);
			
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
				if (vars.creatureMap[[x, y]] == null && vars.itemMap[[x, y]] == null) {
					var nx = Settings.viewerWidth / 2 + x - player.vars.x;
					var ny = Settings.viewerHeight / 2 + y - player.vars.y;
					if (nx >= 0 && ny >= 0 && nx < Settings.viewerWidth && ny < Settings.viewerHeight) 
						viewer.putTile(nx, ny, tiles[[x, y]].symbol, [200, 200, 200]);
				}
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
	var axes = ["x", "y"];
	var isTooSmall = function(room){
		return room.h < 4 || room.w < 4;
	}
	var split = function(room, axis, position){
		var r0, r1;
		if (axis == "x") {
			var variance = Math.floor(room.w / 6);
			position += utils.randInt(-1 * variance, variance);
			// split children on y
			r0 = Room(room.x0, room.y0, position, room.y1);
			r1 = Room(position - 1, room.y0, room.x1, room.y1);
			
			// exit if spliting will result in small rooms
			if (isTooSmall(r0) || isTooSmall(r1)) {
				rooms.push(room);
				return;
			}
			
			split(r0, "y", Math.floor(r0.y0 + r0.h / 2));
			split(r1, "y", Math.floor(r1.y0 + r1.h / 2));
		} else {
			var variance = Math.floor(room.h / 6);
			position += utils.randInt(-1 * variance, variance);
			// split children on x
			r0 = Room(room.x0, room.y0, room.x1, position);
			r1 = Room(room.x0, position - 1, room.x1, room.y1);
			
			// exit if spliting will result in small rooms
			if (isTooSmall(r0) || isTooSmall(r1)) {
				rooms.push(room);
				return;
			}
			
			split(r0, "x", Math.floor(r0.x0 + r0.w / 2));
			split(r1, "x", Math.floor(r1.x0 + r1.w / 2));
		}
	}
	var isValidLocation = function(room, x, y){
		// out of bounds
		if (x == 0 || x == width - 1 || y == 0 || y == height - 1) 
			return false;
		
		// out of reach
		var adjunctWalls = 0;
		// too many doors
		var adjunctDoors = 0;
		for (var ax = -1; ax <= 1; ax += 2) {
			if (rawData[[x + ax, y]] == "#") 
				adjunctWalls++;
			else if (rawData[[x + ax, y]] == "+") 
				adjunctDoors++;
		}
		for (var ay = -1; ay <= 1; ay += 2) {
			if (rawData[[x, y + ay]] == "#") 
				adjunctWalls++;
			else if (rawData[[x, y + ay]] == "+") 
				adjunctDoors++;
		}
		if (adjunctWalls > 2 && adjunctDoors > 0) 
			return false;
		
		return true;
	}
	var insertDoor = function(r){
		var x, y;
		var axis = axes[utils.randInt(0, 1)];
		var startOrEnd = utils.randInt(0, 1);
		if (axis == "x") 
			if (startOrEnd == 0) {
				//left
				x = r.x0;
				y = r.y0 + utils.randInt(2, r.h - 2);
			} else {
				// right
				x = r.x1 - 1;
				y = r.y0 + utils.randInt(2, r.h - 2);
			}
		else if (startOrEnd == 0) {
			// top
			x = r.x0 + utils.randInt(2, r.w - 2);
			y = r.y0;
		} else {
			// buttom
			x = r.x0 + utils.randInt(2, r.w - 2);
			y = r.y1 - 1;
		}
		if (isValidLocation(r, x, y)) 
			rawData[[x, y]] = "+";
		else 
			// try again
			insertDoor(r);
	}
	var insertDoors = function(rooms){
		for (var r = 0; r < rooms.length; r++) {
			var numberOfDoors = utils.randInt(1,3);
			for(var d = 0; d<numberOfDoors; d++)
				insertDoor(rooms[r]);
		}
	}
	var insertRoom = function(r){
		for (var y = r.y0; y < r.y1; y++) 
			for (var x = r.x0; x < r.x1; x++) {
				if (x == r.x0 || y == r.y0 || x == r.x1 - 1 || y == r.y1 - 1) {
					rawData[[x, y]] = "#";
				} else {
					rawData[[x, y]] = ".";
				}
			}
	}
	var insertRooms = function(rooms){
		for (var r = 0; r < rooms.length; r++) 
			insertRoom(rooms[r]);
	}
	
	var generateRandom = function(){
		split(Room(0, 0, width, height), "y", height / 2);
		insertRooms(rooms);
		insertDoors(rooms);
		
		generate(rawData);
	}
	
	var generate = function(data){
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) 
				if (data[[x, y]] == '#') 
					tiles[[x, y]] = Tile('#', Descriptions.wall);
				else if (data[[x, y]] == '+') 
					tiles[[x, y]] = Tile('+', Descriptions.door);
				else 
					tiles[[x, y]] = Tile('.', null);
		}
		
		// Insert player
		vars.creatures[0] = player;
		while(data[[player.vars.x, player.vars.y]]!=".") {
			player.vars.x = utils.randInt(1,width-2); 
			player.vars.y = utils.randInt(1,height-2);
		}
		vars.creatureMap[[player.vars.x, player.vars.y]] = player;
		
		// Generate monsters
		for (var m = 0; m < Settings.monstersPerLevel; m++) {
			var creaure = Creature(utils.randInt(1, width - 2), utils.randInt(1, height - 2), "k");
			while (data[[creaure.vars.x, creaure.vars.y]] != ".") {
				creaure.vars.x = utils.randInt(1, width - 2);
				creaure.vars.y = utils.randInt(1, height - 2);
			}
			vars.creatures.push(creaure);
			for (var c = 0; c < vars.creatures.length; c++) {
				vars.creatures[c].init();
				vars.creatureMap[[vars.creatures[c].vars.x, vars.creatures[c].vars.y]] = vars.creatures[c];
			}
		}
		/*
		// Generate items
		vars.items.push(Item(2, 5, "!"));
		vars.items.push(Item(5, 5, "["));
		vars.items.push(Item(10, 7, "("));
		
		for (var i = 0; i < vars.items.length; i++) {
			vars.items[i].init();
			vars.itemMap[[vars.items[i].vars.x, vars.items[i].vars.y]] = vars.items[i];	
		}
		*/
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
		generateRandom: generateRandom,
		generate: generate
	}
}
