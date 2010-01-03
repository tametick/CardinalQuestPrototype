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
	
	return {
		x: x,
		y: y,
		symbol: symbol,
		description: description,
		draw: draw,
		move: move
	}
}
