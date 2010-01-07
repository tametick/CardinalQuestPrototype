Cursor = function(x, y, symbol){
	var draw = function(){
		viewer.putTile(viewer.center[0] - player.x + this.x, viewer.center[1] - player.y + this.y, symbol, Settings.cursorColor);
	}
	var move = function(dx, dy){
		var newX = this.x + dx;
		var newY = this.y + dy;
		if (newX > 0 && newY > 0 
			&& newX < maps[currentMap].width-1 && newY < maps[currentMap].height-1
			&& player.x-newX<viewer.center[0]+1 && newX-player.x<viewer.center[0]
			&& player.y-newY<viewer.center[1]+1 && newY-player.y<viewer.center[1]
			) {
			this.x = newX;
			this.y = newY;
		}
	}
	
	return {
		x: x,
		y: y,
		draw: draw,
		move: move
	}
}
