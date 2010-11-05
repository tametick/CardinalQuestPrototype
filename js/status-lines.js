var StatusLines = function(){
	var chargeFlashed = false;

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
	var bar = function(val, maxVal, style) {
		/*
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
		*/
		var percent = (val / maxVal) * 100;
		return "<div class='statusBar'><div id='"+style+"' class='"+style+"' style='width: "+percent+"%;'></div></div>";
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
				"Damage: "+stat(dmgRange[0]==dmgRange[1]?dmgRange[0]*dmgMultipler:(dmgRange[0]*dmgMultipler+"-"+dmgRange[1]*dmgMultipler))+"&nbsp; Attack: " + stat(atk,getBuff("attack")!=0) + "&nbsp; Defense: " + stat(def,getBuff("defense")!=0),
				"Vitality: " + stat(vit) + "&nbsp; Speed: " + stat(spd,getBuff("speed")!=0) + "&nbsp; Spirit: " + stat(spr,getBuff("spirit")!=0),
				"<table class='vitals'><tr><td>Life: " + life(lif + "/" + mlif,getBuff("life")>0) + "</td><td>Charge: " + charge(Math.round(100 * player.vars.spiritPoints / 360.0) + "%") + "</td><td>XP: " + experience(player.vars.experiencePoints + "/" + player.nextLevel()) + "&nbsp; Level: " + charLevel(player.vars.level) + "</td></tr>\
				<tr><td>"+life(bar(lif, mlif, 'healthBar')) + "</td><td>" + charge(bar(player.vars.spiritPoints, 360, 'chargeBar')) + "</td><td>" + experience(bar(player.vars.experiencePoints, player.nextLevel(), 'xpBar')) + "</td></tr></table>"
			];
		}
		
		status.empty();
		for (var i = 0; i < data.length; i++) 
			status.append(data[i] + "<br>");

		if ( chargeFlashed == true && player && player.vars.spiritPoints >= 360 ) {
			$(".chargeBar").addClass('chargeBarFlash');
		}
		if ( chargeFlashed == false && player && player.vars.spiritPoints >= 360 ) {
			chargeFlashed = true;
			$(".chargeBar")
				.toggleClass('chargeBarFlash', 25)
				.delay(100)
				.toggleClass('chargeBarFlash', 25)
				.delay(100)
				.toggleClass('chargeBarFlash', 25)
				.delay(100)
				.toggleClass('chargeBarFlash', 25)
				.delay(100)
				.toggleClass('chargeBarFlash', 25)
				.delay(100)
				.toggleClass('chargeBarFlash', 25)
				.delay(100)
				.toggleClass('chargeBarFlash', 25);
		}
		if ( player && player.vars.spiritPoints < 360 ) chargeFlashed = false;

		printNew(empty);
	}

	var renderStat = function(name, value, buffed) {
		var cssClass = '';
		if ( buffed < 0 ) {
			cssClass = 'statDebuffed';
		} else if ( buffed > 0 ) {
			cssClass = 'statBuffed';
		}
		var str = name+": <label class='"+cssClass+"'>"+value+"</label><br />";
		//element.html(str);
		return str;
	}

	var printNew = function(empty) {
		if (empty ) {
			return;
		}
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

		var statsPanel = $("#statsPanel");
		statsPanel.empty();
		var output = '';
		output += renderStat('Damage', dmgRange[0]==dmgRange[1]?dmgRange[0]*dmgMultipler:(dmgRange[0]*dmgMultipler+"-"+dmgRange[1]*dmgMultipler), 0);
		output += renderStat('Attack', atk, getBuff("attack"));
		output += renderStat('Defense', def, getBuff("defense"));
		output += renderStat('Vitality', vit, getBuff("vitality"));
		output += renderStat('Speed', spd, getBuff("speed"));
		output += renderStat('Spirit', spr, getBuff("spirit"));
		statsPanel.html(output);
	}

	return {
		print: print
	}
}
