/* 
 * Cardinal Quest
 * http://www.tametick.com/cq/
 *
 * Copyright (C) 2010, Ido Yehieli
 * Released under the GPL License:
 * http://www.gnu.org/licenses/gpl.txt
 */
 
 
 var StatusLines = function(){
	var chargeFlashed = false;

	var bar = function(val, maxVal, style) {
		var percent = (val / maxVal) * 100;
		return "<div class='statusBar'><div id='"+style+"' class='"+style+"' style='width: "+percent+"%;'></div></div>";
	}
	var getBuff = function(attribute) {
		return player.vars.buffs?(player.vars.buffs[attribute]?player.vars.buffs[attribute]:0):0;
	}
	
	var renderStat = function(name, value, buffed, noBreak) {
		var cssClass;
		var buffSign;
		if ( buffed < 0 ) {
			cssClass = 'statDebuffed';
			buffSign = '-'
		} else if ( buffed > 0 ) {
			cssClass = 'statBuffed';
			buffSign = "+"
		}

		var renderedValue;
		if (buffed) {
			if (isNaN(value - buffed)) {
				renderedValue = "<span class='" + cssClass + "'> " + value + "</span>";
			} else {
				renderedValue = (value - buffed) + "<span class='" + cssClass + "'> " + buffSign + " " + Math.abs(buffed) + "</span>";
			}
		} else {
			renderedValue = value;
		}

		var str = name + ": <label>" + renderedValue + "</label>";
		if ( noBreak == undefined || !noBreak ) str += "<br />";
		return str;
	}

	var print = function(empty) {
		if ( empty ) {
			$("#vitalsPanel").empty();
			$("#statsPanel").empty();
			return;
		}
		// Abilities
		var vit=player.vars.vitality+getBuff("vitality");
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
		output += "Dungeon Level: <label>"+(currentMap+1)+"</label><br />";
		output += renderStat('Damage', dmgRange[0]==dmgRange[1]?dmgRange[0]*dmgMultipler:(dmgRange[0]*dmgMultipler+"-"+dmgRange[1]*dmgMultipler), 0);
		output += renderStat('Attack', atk, getBuff("attack"));
		output += renderStat('Defense', def, getBuff("defense"));
		output += renderStat('Vitality', vit, getBuff("vitality"));
		output += renderStat('Speed', spd, getBuff("speed"));
		output += renderStat('Spirit', spr, getBuff("spirit"));
		statsPanel.html(output);

		var invStats = $("#inventoryStats");
		invStats.empty();
		invStats.html(output);

		var vitalsPanel = $("#vitalsPanel");
		vitalsPanel.empty();
		output = '';
		output += renderStat('Life', lif+"/"+mlif, getBuff("life"));
		output += bar(lif, mlif, 'healthBar') + "<br />";
		output += renderStat('Charge', Math.round(100 * player.vars.spiritPoints / 360.0) + '%', 0);
		output += bar(player.vars.spiritPoints, 360, 'chargeBar') + "<br />";
		output += renderStat('XP', player.vars.experiencePoints+"/"+player.nextLevel(), 0, true) + "  ";
		output += renderStat('Level', player.vars.level, 0);
		output += bar(player.vars.experiencePoints, player.nextLevel(), 'xpBar');
		vitalsPanel.html(output);
		
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
		
	}

	return {
		print: print
	}
}
