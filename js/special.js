var Special = function(){
	var berserk = function(self){
		if (!self.vars.buffs) 
			self.vars.buffs = {};
		
		if (!self.vars.timers) 
			self.vars.timers = [];
		
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
		alert("shadowWalk");
	}
	var fireNova = function(self){
		alert("fireNova");
	}
	return {
		berserk: berserk,
		shadowWalk: shadowWalk,
		fireNova: fireNova
	}
}
