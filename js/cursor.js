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

	var examine = function() {
		if ( maps[currentMap].tiles[[cursor.vars.x, cursor.vars.y]].seen == 2 ) {
			var str = "You see ";
			if (maps[currentMap].vars.creatureMap[[cursor.vars.x, cursor.vars.y]]) {
				str += "<b style='color: rgb("+maps[currentMap].vars.creatureMap[[cursor.vars.x, cursor.vars.y]].vars.color.join()+");'>";
				str += maps[currentMap].vars.creatureMap[[cursor.vars.x, cursor.vars.y]].vars.description[0];
				str += "</b>";
				messageLog.append(str);
			} else if (maps[currentMap].vars.itemMap[[cursor.vars.x, cursor.vars.y]]) {
				str += "<b style='color: rgb("+maps[currentMap].vars.itemMap[[cursor.vars.x, cursor.vars.y]].vars.color.join()+");'>";
				str += maps[currentMap].vars.itemMap[[cursor.vars.x, cursor.vars.y]].vars.description[0];
				str += "</b>";
				messageLog.append(str);
			} else if (maps[currentMap].tiles[[cursor.vars.x, cursor.vars.y]].description) {
				messageLog.append("You see " + maps[currentMap].tiles[[cursor.vars.x, cursor.vars.y]].description[0]);
			}
		}
	}
	
	return {
		vars: vars,
		draw: draw,
		move: move,
		examine: examine
	}
}
