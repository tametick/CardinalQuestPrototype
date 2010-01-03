var Creature = function(x, y, symbol){
	var draw = function(){
		viewer.putTile(viewer.center[0], viewer.center[1], symbol, Settings.PlayerColor);
	}
	var move = function(dx, dy){
		switch (maps[currentMap].tiles[[this.x + dx, this.y + dy]]) {
		case ".":
			maps[currentMap].creatureMap[[this.x, this.y]] = null;
			this.x += dx;
			this.y += dy;
			maps[currentMap].creatureMap[[this.x, this.y]] = this;
			break;
		}
	}
	
	return {
		x: x,
		y: y,
		symbol: symbol,
		draw: draw,
		move: move
	}
}
