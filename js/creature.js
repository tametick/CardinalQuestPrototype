var Creature = function(x, y, symbol, description){
	var draw = function(){
		viewer.putTile(viewer.center[0], viewer.center[1], symbol, Settings.PlayerColor);
	}
	var move = function(dx, dy){
		switch (maps[currentMap].tiles[[this.x + dx, this.y + dy]]) {
		case '.':
		case "'":
			maps[currentMap].creatureMap[[this.x, this.y]] = null;
			this.x += dx;
			this.y += dy;
			maps[currentMap].creatureMap[[this.x, this.y]] = this;
			break;
		case '+':
			maps[currentMap].tiles[[this.x + dx, this.y + dy]] = "'";
		}
	}
	var closeDoor = function(){
		for (var dx = -1; dx <= 1; dx++) 
			for (var dy = -1; dy <= 1; dy++) 
				if (maps[currentMap].tiles[[this.x + dx, this.y + dy]] == "'") {
					maps[currentMap].tiles[[this.x + dx, this.y + dy]] = "+";
					if(this==player)
						messageLog.append("You have closed the door.");
				}
	}
	
	return {
		x: x,
		y: y,
		symbol: symbol,
		description: description,
		draw: draw,
		move: move,
		closeDoor: closeDoor
	}
}
