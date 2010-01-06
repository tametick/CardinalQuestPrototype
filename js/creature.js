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

	var attackOther = function(other){
		other.life -= this.damage;
		if (this.symbol == "@") 
			messageLog.append("You attack " + other.description + ".");
		else 
			messageLog.append(this.description + " attacks you.");
	}

	var act = function(){
		return this.move(Math.floor(Math.random() * 3) - 1, Math.floor(Math.random() * 3) - 1);
	}
	var draw = function(){
		viewer.putTile(viewer.center[0] + this.x - player.x, viewer.center[1] + this.y - player.y, symbol, Settings.PlayerColor);
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
				maps[currentMap].tiles[[this.x + dx, this.y + dy]] = Tile("'", Descriptions.OpenDoor);
				return true; // Open door
			case '#':
				return false;
			}
	}
	var closeDoor = function(){
		for (var dx = -1; dx <= 1; dx++) 
			for (var dy = -1; dy <= 1; dy++) 
				if (maps[currentMap].tiles[[this.x + dx, this.y + dy]].symbol == "'") {
					maps[currentMap].tiles[[this.x + dx, this.y + dy]] = Tile('+', Descriptions.Door);
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
			this.life = type["life"] * 1;
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
