var Item = function(startX, startY, id){
	var vars = {
		x: startX,
		y: startY,
		description: Descriptions[id]
	}
	
	var init = function(){
		item = ItemTypes[id];
		utils.initFromType(vars, item);
	}
	var use = function(creature){
		if (vars.effect == "heal") {
			if (vars.value == "full") 
				creature.vars.life = creature.vars.vitality;
			else 
				creature.vars.life = Math.min(creature.vars.life + value * 1, creature.vars.vitality);
		}
	}
	var equip = function(creature){
		// Return to old item inventory 
		creature.pickUp(creature.vars.equipment.items[vars.type]);
		// Equip new item
		creature.vars.equipment.items[vars.type] = this;
	}
	var wield = function(creature){
		// Return to old item inventory 
		creature.pickUp(creature.vars.equipment.items[vars.type]);
		// Equip new item
		creature.vars.equipment.items[vars.type] = this;
	}
	var draw = function(){
		// fixme: color
		viewer.putTile(viewer.center[0] + vars.x - player.vars.x, viewer.center[1] + vars.y - player.vars.y, id, [200, 0, 0]);
	}
	var stringify = function(){
		return "" + vars.x + "," + vars.y + "," + id;
	}
	// For printing to the inventory screen 
	var toString = function(){
		return id + " - " + vars.description[0];
	}
	
	
	return {
		id: id,
		vars: vars,
		init: init,
		draw: draw,
		use: use,
		equip: equip,
		wield: wield,
		stringify: stringify,
		toString: toString
	}
}
