var StatusLines = function(){
	var status = $("#statusLines");
	
	var print = function(empty){
		var data;
		if (empty)
			data = [" ", " "]; 
		else 
			data = ["x: " + player.vars.x + ", y: " + player.vars.y + ", life: " + player.vars.life + ", charge: " + Math.round(100 * player.vars.spiritPoints / 360.0)+"%", "Ticks: " + ticks];
		
		status.empty();
		for (var i = 0; i < data.length; i++) 
			status.append(data[i] + "<br>");
	}
	
	return {
		print: print
	}
}
