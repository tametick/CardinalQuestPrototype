var Special = function(){
	var _initBuffs = function(self) {
		if (!self.vars.buffs)
			self.vars.buffs = {};

		if (!self.vars.timers)
			self.vars.timers = [];
	}

	var berserk = function(self){
		_initBuffs(self);
		
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
			
		// Add timers to remove buffs
		self.vars.timers.push([60,"speed",3]);
		self.vars.timers.push([60,"attack",3]);
	}
	var shadowWalk = function(self){
		_initBuffs(self);

		self.vars.buffs["shadowWalk"] = 1;
		self.vars.buffs["damageMultipler"] = 2;

		// Add timers to remove buffs
		self.vars.timers.push([60,"shadowWalk",1]);
		self.vars.timers.push([60,"damageMultipler",2]);
	}
	var fireNova = function(self){
		_initBuffs();

		alert("fireNova");
	}
	return {
		berserk: berserk,
		shadowWalk: shadowWalk,
		fireNova: fireNova
	}
}
