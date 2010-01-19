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
			data = [" ", " "," "];
		else 
			data = ["Vitality: " + stat(player.vars.vitality) + "&nbsp; Attack: " + stat(player.vars.attack) + "&nbsp; Defense: " + stat(player.vars.defense) + "&nbsp; Speed: " + stat(player.vars.speed) + "&nbsp; Spirit: " + stat(player.vars.spirit), 
			"Life: " + life(player.vars.life+"/"+player.vars.maxLife) + "&nbsp; Charge: " + charge(Math.round(100 * player.vars.spiritPoints / 360.0) + "%")+"&nbsp; Experience: " + experience(player.vars.experiencePoints+"/"+player.nextLevel())+"&nbsp; Level: " +charLevel(player.vars.level),
			life(bar(player.vars.life,player.vars.maxLife))+"&nbsp;&nbsp;&nbsp;&nbsp; "+charge(bar(player.vars.spiritPoints, 360))+"&nbsp;&nbsp;&nbsp;&nbsp; "+experience(bar(player.vars.experiencePoints,player.nextLevel()))];
		
		status.empty();
		for (var i = 0; i < data.length; i++) 
			status.append(data[i] + "<br>");
	}
	
	return {
		print: print
	}
}
