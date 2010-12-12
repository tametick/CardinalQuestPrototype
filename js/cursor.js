/* 
 * Cardinal Quest
 * http://www.tametick.com/cq/
 *
 * Copyright (C) 2010, Ido Yehieli
 * Released under the GPL License:
 * http://www.gnu.org/licenses/gpl.txt
 */
 
 
var Cursor = function(startX, startY, symbol){
	var vars = {
		x: startX,
		y: startY,
		detailed: false
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
		if ( maps[currentMap].tiles[[vars.x, vars.y]].seen == 2 ) {
			var str = "You see ";
			if (maps[currentMap].vars.creatureMap[[vars.x, vars.y]]) {
				if ( vars.detailed == false ) {
					str += "<b style='color: rgb("+maps[currentMap].vars.creatureMap[[vars.x, vars.y]].vars.color.join()+");'>";
					str += maps[currentMap].vars.creatureMap[[vars.x, vars.y]].vars.description[0];
					str += "</b>";
				} else {
					str = maps[currentMap].vars.creatureMap[[vars.x, vars.y]].vars.description[1];
				}
				messageLog.append(str);
			} else if (maps[currentMap].vars.itemMap[[vars.x, vars.y]].length > 0) {
				if ( vars.detailed == false ) {
					for ( var i = 0; i < maps[currentMap].vars.itemMap[[vars.x, vars.y]].length; i++ ) {
						if ( i > 0 ) str += ", ";
						str += "<b style='color: rgb("+maps[currentMap].vars.itemMap[[vars.x, vars.y]][i].vars.color.join()+");'>";
						str += maps[currentMap].vars.itemMap[[vars.x, vars.y]][i].vars.description[0];
						str += "</b>";
					}
				} else {
					var str = "";
					for ( var i = 0; i < maps[currentMap].vars.itemMap[[vars.x, vars.y]].length; i++ ) {
						if ( i > 0 ) str += "<br />";
						str += maps[currentMap].vars.itemMap[[vars.x, vars.y]][i].vars.description[1];
					}
				}
				messageLog.append(str);
			} else if (maps[currentMap].tiles[[vars.x, vars.y]].description) {
				if ( vars.detailed == true ) {
					messageLog.append("You see " + maps[currentMap].tiles[[vars.x, vars.y]].description[1]);
				} else {
					messageLog.append("You see " + maps[currentMap].tiles[[vars.x, vars.y]].description[0]);
				}
			}
		}
		vars.detailed = false;
	}
	
	return {
		vars: vars,
		draw: draw,
		move: move,
		examine: examine
	}
}
