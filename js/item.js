var Item = function(startX, startY, id){
	vars = {
		x: startX,
		y: startY,
		description: Descriptions[id]
	}
	
	var init = function(){
	
	}
	var effect = {
		heal: function(creature, value){
			// fixme
			if (value == "full") 
				creature.vars.life = creature.vars.vitality;
			else 
				creature.vars.life = Math.min(creature.vars.life + value * 1, creature.vars.vitality);
		}
	}
	var draw = function(){
		// fixme: color
		viewer.putTile(viewer.center[0] + vars.x - player.vars.x, viewer.center[1] + vars.y - player.vars.y, id, [200, 0, 0]);
	}
	var toString = function(){
		return id + " - " + vars.description[0];
	}
	
	return {
		id: id,
		vars: vars,
		init: init,
		draw: draw,
		effect: effect,
		toString: toString
	}
}
