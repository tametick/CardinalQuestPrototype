Cursor = function(startX, startY, symbol){
	var vars = {
		x: startX,
		y: startY
	}
	var draw = function(){
		viewer.putTile(viewer.center[0] - player.vars.x + vars.x, viewer.center[1] - player.vars.y + vars.y, "cursor", symbol, Settings.cursorColor);
	}
	var move = function(dx, dy){
		var newX = vars.x + dx;
		var newY = vars.y + dy;
		if (newX > 0 && newY > 0 &&
			newX < maps[currentMap].width - 1 &&
			newY < maps[currentMap].height - 1 &&
			Math.abs(newX - player.vars.x) < viewer.center[0] &&
			Math.abs(newY - player.vars.y) < viewer.center[1]) {
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
