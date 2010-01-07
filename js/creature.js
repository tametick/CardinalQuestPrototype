var Creature = function(startX, startY, symbol){
	var vars = {
		x: startX,
		y: startY,
		actionPoints: 0,
		faction: 0,
		description: "",
		// Abilities
		vitality: 0,
		attack: 0,
		defense: 0,
		speed: 0,
		// Stats
		life: 0,
		damage: 0
	}
	
	var randInt = function(min, max){
		return min + Math.floor(Math.random() * (max - min + 1));
	}
	var inRange = function(x0, y0, x1, y1){
		return Math.abs(y1 - y0) + Math.abs(x1 - x0) < 5;
	}
	var attackOther = function(other){
		if (Math.random() < vars.attack / (vars.attack + other.vars.defense)) {
			other.vars.life -= vars.damage;
			if (symbol == "@") 
				messageLog.append("You hit " + other.vars.description + ".");
			else 
				messageLog.append(vars.description + " hits you.");
		} else if (symbol == "@") 
			messageLog.append("You miss " + other.vars.description + ".");
		else 
			messageLog.append(vars.description + " misses you.");
	}
	var act = function(){
		var moved = false;
		
		// Chase player if nearby
		if (inRange(vars.x, vars.y, player.vars.x, player.vars.y)) 
			if (Math.abs(player.vars.y - vars.y) > Math.abs(player.vars.x - vars.x)) 
				moved = this.move(0, (player.vars.y - vars.y) / Math.abs(player.vars.y - vars.y));
			else 
				moved = this.move((player.vars.x - vars.x) / Math.abs(player.vars.x - vars.x), 0);
		
		// Move randomly 
		if (!moved) 
			return this.move(Math.floor(Math.random() * 3) - 1, Math.floor(Math.random() * 3) - 1);
		else 
			return true;
	}
	var draw = function(){
		// fixme - load color from creature-types file
		viewer.putTile(viewer.center[0] + vars.x - player.vars.x, viewer.center[1] + vars.y - player.vars.y, symbol, Settings.playerColor);
	}
	var move = function(dx, dy){
		var other = maps[currentMap].vars.creatureMap[[vars.x + dx, vars.y + dy]];
		if (other) {
			if (other.vars.faction == vars.faction) 
				return true; // Bump

			else {
				attackOther(other); // Attack
				return true;
			}
		} else 
			switch (maps[currentMap].tiles[[vars.x + dx, vars.y + dy]].symbol) {
			case '.':
			case "'":
				maps[currentMap].vars.creatureMap[[vars.x, vars.y]] = null;
				vars.x += dx;
				vars.y += dy;
				maps[currentMap].vars.creatureMap[[vars.x, vars.y]] = this;
				return true; // Move
			case '+':
				maps[currentMap].tiles[[vars.x + dx, vars.y + dy]] = Tile("'", Descriptions.openDoor);
				return true; // Open door
			case '#':
				return false;
			}
	}
	var closeDoor = function(){
		for (var dx = -1; dx <= 1; dx++) 
			for (var dy = -1; dy <= 1; dy++) 
				if (maps[currentMap].tiles[[vars.x + dx, vars.y + dy]].symbol == "'") {
					maps[currentMap].tiles[[vars.x + dx, vars.y + dy]] = Tile('+', Descriptions.door);
					if (this == player) 
						messageLog.append("You have closed the door.");
				}
	}
	var stringify = function(){
		return "" + vars.x + "," + vars.y + "," + symbol + "," + vars.actionPoints;
	}
	var init = function(){
		var type;
		if (symbol == "@") {
			// Load attributes
			type = CreatureTypes[symbol]["fighter"];
			vars.vitality = type["vitality"] * 1;
			// Calculate stats
			vars.life = vars.vitality; // level 1 
			vars.damage = 1; // bare hands
		} else {
			type = CreatureTypes[symbol];
			vars.life = randInt(type["life"][0] * 1, type["life"][1] * 1);
			vars.damage = type["damage"] * 1;
		}
		vars.attack = type["attack"] * 1;
		vars.defense = type["defense"] * 1;
		vars.speed = type["speed"] * 1;
		vars.faction = type["faction"] * 1;
		vars.description = Descriptions[symbol];
	}
	
	return {
		symbol: symbol,
		vars: vars,
		act: act,
		draw: draw,
		attackOther: attackOther,
		move: move,
		closeDoor: closeDoor,
		stringify: stringify,
		init: init
	}
}
