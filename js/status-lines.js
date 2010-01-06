var StatusLines = function(){
	var status = $("#statusLines");
	
	var print = function(){
		var data = ["x: " + player.x + ", y: " + player.y + ", life: " + player.life, "Ticks: " + ticks];
		status.empty();
		for (var i = 0; i < data.length; i++) 
			status.append(data[i] + "<br>");
	}
	
	return {
		print: print
	}
}
