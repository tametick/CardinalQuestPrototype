var StatusLines = function(player){
	var status = $("#statusLines");
	
	var print = function(){
		var data = ["x: " + player.x, "y: " + player.y];
		status.empty();
		for (var i = 0; i < data.length; i++) 
			status.append(data[i] + "<br>");
	}
	
	return {
		print: print
	}
}
