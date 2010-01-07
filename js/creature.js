var Creature = function(x, y, symbol){
	var actionPoints = 0;
	var faction;
	var description;
	// Abilities
	var vitality;
	var attack;
	var defense;
	var speed;
	// Stats
	var life;
	var damage;
	
	var randInt = function(min, max){
		return min + Math.floor(Math.random() * (max - min + 1));
	}
	var inRange = function(x0, y0, x1, y1){
		return Math.abs(y1 - y0) + Math.abs(x1 - x0) < 5;
	}
	var attackOther = function(other){
		if (Math.random() < this.attack / (this.attack + other.defense)) {
			other.life -= this.damage;
			if (this.symbol == "@") 
				messageLog.append("You hit " + other.description + ".");
			else 
				messageLog.append(this.description + " hits you.");
		} else if (this.symbol == "@") 
			messageLog.append("You miss " + other.description + ".");
		else 
			messageLog.append(this.description + " misses you.");
	}
	var act = function(){
		var moved = false;
		
		// Chase player if nearby
		if (inRange(this.x, this.y, player.x, player.y)) 
			if (Math.abs(player.y - this.y) > Math.abs(player.x - this.x)) 
				moved = this.move(0, (player.y - this.y)/Math.abs(player.y - this.y));
			else 
				moved = this.move((player.x - this.x) / Math.abs(player.x - this.x), 0);
		
		// Move randomly 
		if (!moved) 
			return this.move(Math.floor(Math.random() * 3) - 1, Math.floor(Math.random() * 3) - 1);
		else 
			return true;
	}
	var draw = function(){
		// fixme - load color from creature-types file
		viewer.putTile(viewer.center[0] + this.x - player.x, viewer.center[1] + this.y - player.y, symbol, Settings.playerColor);
	}
	var move = function(dx, dy){
		var other = maps[currentMap].creatureMap[[this.x + dx, this.y + dy]];
		if (other) {
			if (other.faction == this.faction) 
				return true; // Bump

			else {
				this.attackOther(other); // Attack
				return true;
			}
		} else 
			switch (maps[currentMap].tiles[[this.x + dx, this.y + dy]].symbol) {
			case '.':
			case "'":
				maps[currentMap].creatureMap[[this.x, this.y]] = null;
				this.x += dx;
				this.y += dy;
				maps[currentMap].creatureMap[[this.x, this.y]] = this;
				return true; // Move
			case '+':
				maps[currentMap].tiles[[this.x + dx, this.y + dy]] = Tile("'", Descriptions.openDoor);
				return true; // Open door
			case '#':
				return false;
			}
	}
	var closeDoor = function(){
		for (var dx = -1; dx <= 1; dx++) 
			for (var dy = -1; dy <= 1; dy++) 
				if (maps[currentMap].tiles[[this.x + dx, this.y + dy]].symbol == "'") {
					maps[currentMap].tiles[[this.x + dx, this.y + dy]] = Tile('+', Descriptions.door);
					if (this == player) 
						messageLog.append("You have closed the door.");
				}
	}
	var stringify = function(){
		return "" + this.x + "," + this.y + "," + this.symbol + "," + this.actionPoints;
	}
	var init = function(){
		var type;
		if (symbol == "@") {
			type = CreatureTypes[symbol]["fighter"];
			this.vitality = type["vitality"] * 1;
			this.life = this.vitality; // level 1 
			this.damage = 1; // bare hands
		} else {
			type = CreatureTypes[symbol];
			this.life = randInt(type["life"][0] * 1, type["life"][1] * 1);
			this.damage = type["damage"] * 1;
		}
		this.attack = type["attack"] * 1;
		this.defense = type["defense"] * 1;
		this.speed = type["speed"] * 1;
		this.faction = type["faction"] * 1;
		this.description = Descriptions[symbol];
	}
	
	return {
		x: x,
		y: y,
		vitality: vitality,
		attack: attack,
		defense: defense,
		speed: speed,
		life: life,
		damage: damage,
		faction: faction,
		actionPoints: actionPoints,
		symbol: symbol,
		description: description,
		act: act,
		draw: draw,
		attackOther: attackOther,
		move: move,
		closeDoor: closeDoor,
		stringify: stringify,
		init: init
	}
}
