var Creature = function(startX, startY, id){
	var Inventory = function(maxSize){
		var items = [];
		var print = function(currentLine){
			$("#inventoryItems").empty();
			for (var i = 0; i < items.length; i++) {
				if (state == State.inventory && i == currentLine) {
					$("#inventoryItems").append(">&nbsp;");
					messageLog.append(items[i].vars.description[1])
				} else 
					$("#iinventoryItems").append("&nbsp;&nbsp;");
				$("#inventoryItems").append(items[i].toString() + "<br>");
			}
		}
		var stringify = function(){
			var str = items.length + ".";
			for (var i = 0; i < items.length; i++) 
				str += items[i].id + ".";
			
			return str;
		}
		return {
			maxSize: maxSize,
			items: items,
			print: print,
			stringify: stringify
		}
	}
	var Equipment = function(){
		var items = {};
		
		var print = function(currentLine){
			$("#equipmentItems").empty();
			var i = 0;
			for (var itemType in items) {
				if (state == State.equipment && i == currentLine) {
					$("#equipmentItems").append(">&nbsp;");
					messageLog.append(items[itemType].vars.description[1])
				} else 
					$("#equipmentItems").append("&nbsp;&nbsp;");
				$("#equipmentItems").append(items[itemType].toString() + "<br>");
				i++;
			}
		}
		var stringify = function(){
			var str = items.length + ".";
			for (var i = 0; i < items.length; i++) 
				str += items[i].id + ".";
			return str;
		}
		return {
			items: items,
			print: print,
			stringify: stringify
		}
	}
	var Weapon = function() {
		var wielded = [];
		
		var print = function(currentLine){
			$("#weaponWielded").empty();
			if(wielded.length > 0)
				$("#weaponWielded").append("&nbsp;&nbsp;"+wielded[0].toString());
		}
		var stringify = function(){
			if(wielded.length > 0)
				return wielded[0].id;
			else
				return "";
		}
		return {
			wielded: wielded,
			print: print,
			stringify: stringify
		}
	}
	
	
	var vars = {
		x: startX,
		y: startY,
		actionPoints: 0,
		spiritPoints: 0,
	}
	var drop = function(itemIndex){
		if (vars.inventory.items.length > itemIndex) {
			var item = vars.inventory.items[itemIndex];
			vars.inventory.items.remove(itemIndex);
			maps[currentMap].vars.items.push(item);
			item.vars.x = vars.x;
			item.vars.y = vars.y;
			maps[currentMap].vars.itemMap[[vars.x, vars.y]] = item;
			if (this == player) 
				messageLog.append("You dropped the " + item.vars.description[0]);
		}
	}
	var use = function(itemIndex){
		if (vars.inventory.items.length > itemIndex) {
			var item = vars.inventory.items[itemIndex];
			vars.inventory.items.remove(itemIndex);
			
			switch (item.vars.type) {
				case "consumable":
					item.use(this);
					if (this == player) 
						messageLog.append("You used the " + item.vars.description[0]);
					break;
				case "shoes":
				case "hat":
				case "armor":
				case "jewelry":
				case "gloves":
					item.equip(this);
					if (this == player) 
						messageLog.append("You wear the " + item.vars.description[0]);				
					break;
				case "weapon":
					item.wield(this);
					if (this == player) 
						messageLog.append("You wield the " + item.vars.description[0]);
					break;
			}
			
		}
	}
	var attackOther = function(other){
		if (Math.random() < vars.attack / (vars.attack + other.vars.defense)) {
			// Hit
			if (vars.weapon && vars.weapon.wielded.length > 0) {
				// With weapon
				var damageRange = vars.weapon.wielded[0].vars.damage;
				other.vars.life -= utils.randInt(damageRange[0] * 1, damageRange[1] * 1);
			} else {
				// With natural attack
				other.vars.life -= utils.randInt(vars.damage[0] * 1, vars.damage[1] * 1);
			}
			if (other.vars.life > 0) {
				// Injure
				if (id.charAt(0) == "@") 
					messageLog.append("You hit " + other.vars.description[0] + ".");
				else {
					messageLog.append(vars.description[0] + " hits you.");
				}
			} else {
				// Kill
				var index = jQuery.inArray(other, maps[currentMap].vars.creatures);
				if (index != -1) 
					maps[currentMap].vars.creatures.remove(index);
				else 
					throw "Error: creature exist in creatureMap but not in creatures.";
				maps[currentMap].vars.creatureMap[[other.vars.x, other.vars.y]] = null;
				
				if (id.charAt(0) == "@") {
					messageLog.append("You killed " + other.vars.description[0] + "!");
				} else {
					messageLog.append(vars.description[0] + " has killed you!");
					alert("You have Perished.\nGame Over.");
					state = State.menu;
				}
			}
		} else {
			// Miss
			if (id.charAt(0) == "@") 
				messageLog.append("You miss " + other.vars.description[0] + ".");
			else 
				messageLog.append(vars.description[0] + " misses you.");
		}
	}
	var executeSpecial = function() {
		if (vars.spiritPoints == 360) {
			alert("SPECIAL!!");
			vars.spiritPoints = 0;
		} else
			messageLog.append("You are insufficiently charged.");
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
		viewer.putTile(viewer.center[0] + vars.x - player.vars.x, viewer.center[1] + vars.y - player.vars.y, vars.symbol, Settings.playerColor);
	}
	
	var pickUp = function(item, dx, dy, isPlayer){
		if (item && vars.inventory)
			if (vars.inventory.items.length < vars.inventory.maxSize) {
			
				if (dx != null && dy != null) {
					// Remove from map
					var itemIndex = jQuery.inArray(item, maps[currentMap].vars.items);
					if (itemIndex != -1) {
						maps[currentMap].vars.items.remove(itemIndex);
						maps[currentMap].vars.itemMap[[vars.x + dx, vars.y + dy]] = null;
					}
				}
				
				// Put in inventory
				vars.inventory.items.push(item);
				if (isPlayer) 
					messageLog.append("You picked up a " + item.vars.description[0]);
			}
	}
	
	var move = function(dx, dy){
		// Stuff occupying destination
		var other = maps[currentMap].vars.creatureMap[[vars.x + dx, vars.y + dy]];
		var item = maps[currentMap].vars.itemMap[[vars.x + dx, vars.y + dy]];
		
		if (other) {
			if (other.vars.faction == vars.faction) 
				// Bump
				return true;
			else {
				// Attack
				this.attackOther(other);
				return true;
			}
		} else {
			// Pick up item
			pickUp(item, dx, dy, this == player);
			
			// Move
			switch (maps[currentMap].tiles[[vars.x + dx, vars.y + dy]].symbol) {
			case '.':
			case "'":
				// Move
				maps[currentMap].vars.creatureMap[[vars.x, vars.y]] = null;
				vars.x += dx;
				vars.y += dy;
				maps[currentMap].vars.creatureMap[[vars.x, vars.y]] = this;
				return true;
			case '+':
				// Open door
				maps[currentMap].tiles[[vars.x + dx, vars.y + dy]] = Tile("'", Descriptions.openDoor);
				return true;
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
		var str = "" + vars.x + "," + vars.y + "," + id + "," + vars.actionPoints + "," + vars.spiritPoints + "," + vars.life;
		if (vars.inventory) 
			str += "," + vars.inventory.stringify();
		return str;
	}
	var init = function(){
		var type = CreatureTypes[id];
		
		utils.initFromType(vars, type);		
		if (id.charAt(0) == "@") {
			vars.description = Descriptions["@"];
			// Calculate stats
			vars.life = vars.vitality; // level 1 
			vars.damage = [1,1]; // bare hands
			// fixme - don't hard code size
			vars.inventory = Inventory(6);
			vars.equipment = Equipment();
			vars.weapon = Weapon();
		} else {
			// Roll hp
			vars.description = Descriptions[id];
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
		executeSpecial: executeSpecial,
		drop: drop,
		pickUp: pickUp,
		use: use,
		stringify: stringify,
		init: init
	}
}
