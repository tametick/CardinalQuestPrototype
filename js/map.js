var Map = function(width, height){
	var tiles = [];
	var viewerCenter = [Settings.ViewerWidth/2, Settings.ViewerHeight/2];
	
	// Draw the map around the player
	draw = function(){
		for (var y = 0; y < height; y++)
			for (var x = 0; x < width; x++) 
				viewer.putTile(
					Settings.ViewerWidth/2 + x - player.x, 
					Settings.ViewerHeight/2 + y - player.y, 
					tiles[y][x], [255,255,255]);
	}
	
	for (var y = 0; y < height; y++) {
		tiles[y] = [];
		for (var x = 0; x < width; x++) {
			tiles[y][x] = '.';
		}
	}
	
	return {
		width: width,
		height: height,
		tiles: tiles,
		draw: draw
	}
}
