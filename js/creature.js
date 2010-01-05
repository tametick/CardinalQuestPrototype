var Creature = function(x, y, speed, symbol, description){
	var actionPoints = 0;

	var act = function(){
		return this.move(Math.floor(Math.random()*3)-1, Math.floor(Math.random()*3)-1);
	}
	var draw = function(){
		viewer.putTile(viewer.center[0] + this.x - player.x, viewer.center[1] + this.y - player.y, symbol, Settings.PlayerColor);
	}
	var move = function(dx, dy){
		if (maps[currentMap].creatureMap[[this.x + dx, this.y + dy]]) 
			return true; // Bump
		else 
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
		return "" + this.x + "," + this.y + "," + symbol;
	}
	
	return {
		x: x,
		y: y,
		speed: speed,
		actionPoints: actionPoints,
		symbol: symbol,
		description: description,
		act: act,
		draw: draw,
		move: move,
		closeDoor: closeDoor,
		stringify: stringify
	}
}
