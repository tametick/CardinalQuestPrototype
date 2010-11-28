/* 
 * Cardinal Quest
 * http://www.tametick.com/cq/
 *
 * Copyright (C) 2010, Ido Yehieli
 * Released under the GPL License:
 * http://www.gnu.org/licenses/gpl.txt
 */
 
 
 var Special = function(){
	var _initBuffs = function(self) {
		if (!self.vars.buffs)
			self.vars.buffs = {};

		if (!self.vars.timers)
			self.vars.timers = [];
	}

	var berserk = function(self){
		$("#berserk_sfx").get()[0].play();

		_initBuffs(self);
		
		// visibleEffect
		self.vars.visibleEffect = "berserk";

		// Accumulate speed buffs
		if (self.vars.buffs["speed"]) 
			self.vars.buffs["speed"] += 3;
		else 
			self.vars.buffs["speed"] = 3;
		
		// Accumulate attack buffs
		if (self.vars.buffs["attack"]) 
			self.vars.buffs["attack"] += 3;
		else 
			self.vars.buffs["attack"] = 3;
			
		// Add timers to remove buffs & visibleEffect
		self.vars.timers.push([60,"speed",3]);
		self.vars.timers.push([60,"attack",3]);
		self.vars.timers.push([60,"berserk"]);
	}
	var shadowWalk = function(self){
		$("#shadowwalk_sfx").get()[0].play();

		_initBuffs(self);

		// visibleEffect
		self.vars.visibleEffect = "shadowwalk";

		self.vars.buffs["shadowWalk"] = 1;
		self.vars.buffs["damageMultipler"] = 2;

		// Add timers to remove buffs
		self.vars.timers.push([60,"shadowWalk",1]);
		self.vars.timers.push([60,"damageMultipler",2]);
		self.vars.timers.push([60,"shadowwalk"]);
	}
	var fireNova = function(self){
		$("#firenova_sfx").get()[0].play();
		var radius = 2;

		viewer.fireNovaEffect(radius);

		_initBuffs(self);

		for(var x = -radius; x<=radius;x++)
			for(var y = -radius; y<=radius;y++)
				if(utils.dist(x,y,0,0)<=radius) {
					var creature = maps[currentMap].vars.creatureMap[[self.vars.x+x, self.vars.y+y]];
					if(creature && creature!=self) {
						creature.vars.life -= utils.randInt(1, 6);

						// life buffs
						var lif = creature.vars.life + (creature.vars.buffs ? (creature.vars.buffs.life ? creature.vars.buffs.life : 0) : 0);

						if (lif > 0)
							self.injure(creature);
						else
							self.kill(creature);
					}
				}
	}
	var weaken = function(self) {
		// TODO: Add sound
		// TODO: Add visibleEffect to player

		_initBuffs(player);

		var debuffAmount = Math.floor(player.vars.attack / 2);
		if ( player.vars.buffs["attack"]) {
			player.vars.buffs["attack"] -= debuffAmount;
		} else {
			player.vars.buffs["attack"] = -debuffAmount;
		}

		player.vars.timers.push([60,"attack",-debuffAmount]);
	}
	var slow = function(self) {
		// TODO: Add sound
		// TODO: Add visibleEffect to player

		_initBuffs(player);

		var debuffAmount = Math.floor(player.vars.speed / 2);
		if ( player.vars.buffs["speed"]) {
			player.vars.buffs["speed"] -= debuffAmount;
		} else {
			player.vars.buffs["speed"] = -debuffAmount;
		}

		player.vars.timers.push([60,"speed",-debuffAmount]);
	}
	var disease = function(self) {
		// TODO: Add sound
		// TODO: Add visibleEffect to player

		_initBuffs(player);

		var debuffAmount = Math.floor(player.vars.defense / 2);
		if ( player.vars.buffs["defense"]) {
			player.vars.buffs["defense"] -= debuffAmount;
		} else {
			player.vars.buffs["defense"] = -debuffAmount;
		}

		player.vars.timers.push([60,"defense",-debuffAmount]);
	}
	return {
		berserk: berserk,
		shadowWalk: shadowWalk,
		fireNova: fireNova,
		weaken: weaken,
		slow: slow,
		disease: disease
	}
}
