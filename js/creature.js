var Creature = function(startX, startY){
	var x = startX;
	var y = startY;
	var symbol = '@';
	var viewerCenter = [Settings.ViewerWidth / 2, Settings.ViewerHeight / 2];
	
	var draw = function(){
		viewer.putTile(viewerCenter[0], viewerCenter[1], this.symbol, Settings.PlayerColor);
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
