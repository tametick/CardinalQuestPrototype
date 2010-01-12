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
	var applyBuff = function(creature){
		if (!creature.vars.buffs) 
			creature.vars.buffs = {};
		if (isNaN(vars.value)) 
			// Override previous buff
			creature.vars.buffs[vars.effect] = vars.value;
		else {
			// Accumulate buffs
			if (creature.vars.buffs[vars.effect]) 
				creature.vars.buffs[vars.effect] += vars.value * 1;
			else 
				creature.vars.buffs[vars.effect] = vars.value * 1;
		}
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
		// TODO: Remove old buff
		
		// Equip new item
		creature.vars.equipment.items[vars.type] = this;
		applyBuff(creature);
	}
	var wield = function(creature){
		// Return to old item inventory 
		creature.pickUp(creature.vars.weapon.wielded.pop());
		// TODO: Remove old buff
		
		// Wield new weapon
		creature.vars.weapon.wielded.push(this);
		applyBuff(creature);
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
		applyBuff: applyBuff,
		use: use,
		equip: equip,
		wield: wield,
		stringify: stringify,
		toString: toString
	}
}
