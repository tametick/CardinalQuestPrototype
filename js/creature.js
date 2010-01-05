var Creature = function(x, y, symbol, description){
	var draw = function(){
		viewer.putTile(viewer.center[0]+this.x-player.x, viewer.center[1]+this.y-player.y, symbol, Settings.PlayerColor);
	}
	var move = function(dx, dy){
		switch (maps[currentMap].tiles[[this.x + dx, this.y + dy]].symbol) {
		case '.':
		case "'":
			maps[currentMap].creatureMap[[this.x, this.y]] = null;
			this.x += dx;
			this.y += dy;
			maps[currentMap].creatureMap[[this.x, this.y]] = this;
			break;
		case '+':
			maps[currentMap].tiles[[this.x + dx, this.y + dy]] = Tile("'", Descriptions.OpenDoor);
		}
	}
	var closeDoor = function(){
		for (var dx = -1; dx <= 1; dx++) 
			for (var dy = -1; dy <= 1; dy++) 
				if (maps[currentMap].tiles[[this.x + dx, this.y + dy]].symbol == "'") {
					maps[currentMap].tiles[[this.x + dx, this.y + dy]] =  Tile('+',Descriptions.Door);
					if(this==player)
						messageLog.append("You have closed the door.");
				}
	}
	var stringify = function(){
		return ""+this.x+","+this.y+","+symbol;
	}
	
	return {
		x: x,
		y: y,
		symbol: symbol,
		description: description,
		draw: draw,
		move: move,
		closeDoor: closeDoor,
		stringify: stringify
	}
}
