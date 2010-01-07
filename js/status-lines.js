var StatusLines = function(){
	var status = $("#statusLines");
	
	var print = function(){
		var data = ["x: " + player.vars.x + ", y: " + player.vars.y + ", life: " + player.vars.life, "Ticks: " + ticks];
		status.empty();
		for (var i = 0; i < data.length; i++) 
			status.append(data[i] + "<br>");
	}
	
	return {
		print: print
	}
}
