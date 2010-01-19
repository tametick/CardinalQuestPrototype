var StatusLines = function(){
	var status = $("#statusLines");
	var stat = function(text){
		return '<span style="color:Yellow;">' + text + '</span>';
	}
	var life = function(text){
		return '<span style="color:ForestGreen;">' + text + '</span>';
	}
	var charge = function(text){
		return '<span style="color:MediumOrchid;">' + text + '</span>';
	}
	var experience = function(text){
		return '<span style="color:Orange;">' + text + '</span>';
	}
	var charLevel = function(text){
		return '<span style="color:IndianRed;">' + text + '</span>';  
	}
	var bar = function(val, maxVal) {
		var points = 10.0;
		var NormI = val * points / maxVal;

		var asBar = "[";
		for (var j = 0; j < points; j++)
			if (j < NormI)
				asBar += "=";
			else
				asBar += ".";
		asBar += "]";
		
		return '<span style="font-family:monospace;">'+asBar+'</span>';
	}
	var print = function(empty){
		var data;
		if (empty) 
			data = [" ", " ", " "];
		else {
			// Abilities
			var vit=player.vars.vitality;//+player.vars.buffs?(player.vars.buffs.vitality?player.vars.buffs.vitality:0):0;
			var atk=player.vars.attack+(player.vars.buffs?(player.vars.buffs.attack?player.vars.buffs.attack:0):0);
			var def=player.vars.defense+(player.vars.buffs?(player.vars.buffs.defense?player.vars.buffs.defense:0):0);
			var spd=player.vars.speed+(player.vars.buffs?(player.vars.buffs.speed?player.vars.buffs.speed:0):0);
			var spr=player.vars.spirit+(player.vars.buffs?(player.vars.buffs.spirit?player.vars.buffs.spirit:0):0);
			// stats
			var lif = player.vars.life+(player.vars.buffs?(player.vars.buffs.life?player.vars.buffs.life:0):0);
			var mlif = player.vars.maxLife+(player.vars.buffs?(player.vars.buffs.life?player.vars.buffs.life:0):0);
			
			data = [
			"Vitality: " + stat(vit) + "&nbsp; Attack: " + stat(atk) + "&nbsp; Defense: " + stat(def) + "&nbsp; Speed: " + stat(spd) + "&nbsp; Spirit: " + stat(spr), 
			"Life: " + life(lif + "/" + mlif) + "&nbsp; Charge: " + charge(Math.round(100 * player.vars.spiritPoints / 360.0) + "%") + "&nbsp; Experience: " + experience(player.vars.experiencePoints + "/" + player.nextLevel()) + "&nbsp; Level: " + charLevel(player.vars.level), 
			life(bar(lif, mlif)) + "&nbsp;&nbsp;&nbsp;&nbsp; " + charge(bar(player.vars.spiritPoints, 360)) + "&nbsp;&nbsp;&nbsp;&nbsp; " + experience(bar(player.vars.experiencePoints, player.nextLevel()))
			];
		}
		
		status.empty();
		for (var i = 0; i < data.length; i++) 
			status.append(data[i] + "<br>");
	}
	
	return {
		print: print
	}
}
