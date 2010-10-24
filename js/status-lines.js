var StatusLines = function(){
	var status = $("#statusLines");
	var stat = function(text, isBuffed){
		var color = isBuffed?'Red':'Yellow';
		return '<span style="color:'+color+';">' + text + '</span>';
	}
	var life = function(text, isBuffed){
		var color = isBuffed?'Red':'ForestGreen';
		return '<span style="color:'+color+';">' + text + '</span>';
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
	var getBuff = function(attribute) {
		return player.vars.buffs?(player.vars.buffs[attribute]?player.vars.buffs[attribute]:0):0;
	}
	
	var print = function(empty){
		var data;
		if (empty) 
			data = [" ", " ", " ", " "];
		else {
			// Abilities
			var vit=player.vars.vitality;
			var atk=player.vars.attack+getBuff("attack");
			var def=player.vars.defense+getBuff("defense");
			var spd=player.vars.speed+getBuff("speed");
			var spr=player.vars.spirit+getBuff("spirit");
			// stats
			var dmgMultipler = 1;
			if(player.vars.buffs && player.vars.buffs.damageMultipler && player.vars.buffs.damageMultipler!=0)
				dmgMultipler = player.vars.buffs.damageMultipler * 1;
			
			// natural damage
			var dmgRange=player.vars.damage;
			// weapon damage
			if(player.vars.weapon.wielded[0])
				dmgRange= player.vars.weapon.wielded[0].vars.damage;

			var lif = player.vars.life+getBuff("life");
			var mlif = player.vars.maxLife+getBuff("life");
			
			data = [
			"Damage: "+stat(dmgRange[0]==dmgRange[1]?dmgRange[0]*dmgMultipler:(dmgRange[0]*dmgMultipler+"-"+dmgRange[1]*dmgMultipler))+"&nbsp; Attack: " + stat(atk,getBuff("attack")>0) + "&nbsp; Defense: " + stat(def,getBuff("defense")>0),
			"Vitality: " + stat(vit) + "&nbsp; Speed: " + stat(spd,getBuff("speed")>0) + "&nbsp; Spirit: " + stat(spr,getBuff("spirit")>0),
			"Life: " + life(lif + "/" + mlif,getBuff("life")>0) + "&nbsp; Charge: " + charge(Math.round(100 * player.vars.spiritPoints / 360.0) + "%") + "&nbsp; Experience: " + experience(player.vars.experiencePoints + "/" + player.nextLevel()) + "&nbsp; Level: " + charLevel(player.vars.level), 
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
