Cursor = function(startX, startY, symbol){
	vars = {
		x: startX,
		y: startY
	}
	var draw = function(){
		viewer.putTile(viewer.center[0] - player.x + vars.x, viewer.center[1] - player.y + vars.y, symbol, Settings.cursorColor);
	}
	var move = function(dx, dy){
		var newX = vars.x + dx;
		var newY = vars.y + dy;
		if (newX > 0 && newY > 0 &&
		newX < maps[currentMap].width - 1 &&
		newY < maps[currentMap].height - 1 &&
		player.x - newX < viewer.center[0] + 1 &&
		newX - player.x < viewer.center[0] &&
		player.y - newY < viewer.center[1] + 1 &&
		newY - player.y < viewer.center[1]) {
			vars.x = newX;
			vars.y = newY;
		}
	}
	
	return {
		vars: vars,
		draw: draw,
		move: move
	}
}
