var Creature = function(startX, startY, id){
	var Inventory = function(maxSize){
		var items = [];
		var print = function(currentLine){
			$("#items").empty();
			for (var i = 0; i < items.length; i++) {
				if (currentLine != null && i == currentLine) {
					$("#items").append(">&nbsp;");
					messageLog.append(items[i].vars.description[1])
				} else 
					$("#items").append("&nbsp;&nbsp;");
				$("#items").append(items[i].toString() + "<br>");
			}
		}
		return {
			maxSize: maxSize,
			items: items,
			print: print
		}
	}
	
	var vars = {
		x: startX,
		y: startY,
		actionPoints: 0,
		spiritPoints: 0,
	}
	var drop = function(itemIndex) {
		if (vars.inventory.items.length > itemIndex) {
			var item = vars.inventory.items[itemIndex];
			vars.inventory.items.remove(itemIndex);
			maps[currentMap].vars.items.push(item);
			item.vars.x = vars.x;
			item.vars.y = vars.y;
			maps[currentMap].vars.itemMap[[vars.x, vars.y]] = item;
			if(this==player)
				messageLog.append("You dropped the "+item.vars.description[0]);
		}
	}
	var use = function(itemIndex) {
		if (vars.inventory.items.length > itemIndex) {
			var item = vars.inventory.items[itemIndex];
			vars.inventory.items.remove(itemIndex);
			item.use(this);
			if(this==player)
				messageLog.append("You used the "+item.vars.description[0]);
		}
	}	
	var attackOther = function(other){
		if (Math.random() < vars.attack / (vars.attack + other.vars.defense)) {
			other.vars.life -= vars.damage;
			if (id == "@") 
				messageLog.append("You hit " + other.vars.description[0] + ".");
			else 
				messageLog.append(vars.description[0] + " hits you.");
		} else if (id == "@") 
			messageLog.append("You miss " + other.vars.description[0] + ".");
		else 
			messageLog.append(vars.description[0] + " misses you.");
	}
	var act = function(){
		var moved = false;
		
		// Chase player if nearby
		if (utils.inRange(vars.x, vars.y, player.vars.x, player.vars.y)) 
			if (Math.abs(player.vars.y - vars.y) > Math.abs(player.vars.x - vars.x)) 
				moved = this.move(0, (player.vars.y - vars.y) / Math.abs(player.vars.y - vars.y));
			else 
				moved = this.move((player.vars.x - vars.x) / Math.abs(player.vars.x - vars.x), 0);
		
		// Move randomly 
		if (!moved) 
			return this.move(utils.randInt(-1, 1), utils.randInt(-1, 1));
		else 
			return true;
	}
	var draw = function(){
		// fixme - load color from creature-types file
		viewer.putTile(viewer.center[0] + vars.x - player.vars.x, viewer.center[1] + vars.y - player.vars.y, id, Settings.playerColor);
	}
	var move = function(dx, dy){
		var other = maps[currentMap].vars.creatureMap[[vars.x + dx, vars.y + dy]];
		var item = maps[currentMap].vars.itemMap[[vars.x + dx, vars.y + dy]];
		if (other) {
			if (other.vars.faction == vars.faction) 
				return true; // Bump

			else {
				attackOther(other); // Attack
				return true;
			}
		} else {
			// Pick up item
			if (item && vars.inventory) {
				if (vars.inventory.items.length < vars.inventory.maxSize) {
					var itemIndex = jQuery.inArray(item, maps[currentMap].vars.items);
					if (itemIndex != -1) 
						maps[currentMap].vars.items.remove(itemIndex);
					else 
						throw "Error: item exist in itemMap but not in items.";
					maps[currentMap].vars.itemMap[[vars.x + dx, vars.y + dy]] = null;
					
					vars.inventory.items.push(item);
					if (this == player) 
						messageLog.append("You picked up a " + item.vars.description[0]);
				}
			}
			
			// Move
			switch (maps[currentMap].tiles[[vars.x + dx, vars.y + dy]].symbol) {
			case '.':
			case "'":
				maps[currentMap].vars.creatureMap[[vars.x, vars.y]] = null;
				vars.x += dx;
				vars.y += dy;
				maps[currentMap].vars.creatureMap[[vars.x, vars.y]] = this;
				return true; // Move
			case '+':
				maps[currentMap].tiles[[vars.x + dx, vars.y + dy]] = Tile("'", Descriptions.openDoor);
				return true; // Open door
			case '#':
				return false;
			}
		}
	}
	var closeDoor = function(){
		var closed = false;
		for (var dx = -1; dx <= 1; dx++) 
			for (var dy = -1; dy <= 1; dy++) 
				if (maps[currentMap].tiles[[vars.x + dx, vars.y + dy]].symbol == "'" &&
				!(maps[currentMap].vars.creatureMap[[vars.x + dx, vars.y + dy]])) {
					closed = true;
					maps[currentMap].tiles[[vars.x + dx, vars.y + dy]] = Tile('+', Descriptions.door);
					if (this == player) 
						messageLog.append("You have closed the door.");
				}
		return closed;
	}
	var stringify = function(){
		return "" + vars.x + "," + vars.y + "," + id + "," + vars.actionPoints + "," + vars.spiritPoints + "," + vars.life;
	}
	var init = function(){
		var type;
		if (id == "@") 
			type = CreatureTypes[id]["fighter"];
		else 
			type = CreatureTypes[id];
		
		for (var property in type) 
			if (isNaN(type[property])) 
				vars[property] = type[property];
			else 
				vars[property] = type[property] * 1;
		
		vars.description = Descriptions[id];
		
		if (id == "@") {
			// Calculate stats
			vars.life = vars.vitality; // level 1 
			vars.damage = 1; // bare hands
			// fixme - don't hard code size
			vars.inventory = Inventory(6);
		} else {
			// Roll hp
			vars.life = utils.randInt(vars.life[0] * 1, vars.life[1] * 1);
		}
	}
	
	return {
		id: id,
		vars: vars,
		act: act,
		draw: draw,
		attackOther: attackOther,
		move: move,
		closeDoor: closeDoor,
		drop: drop,
		use: use,
		stringify: stringify,
		init: init
	}
}
