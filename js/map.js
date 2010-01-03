var Map = function(width, height){
	var tiles = [];
	var creatures = [];
	var creatureMap = [];
	var viewerCenter = [Settings.ViewerWidth / 2, Settings.ViewerHeight / 2];
	
	// Draw the map around the player
	draw = function(){
		for (var y = 0; y < height; y++) 
			for (var x = 0; x < width; x++) 
				if (creatureMap[[x, y]] == null) 
					viewer.putTile(Settings.ViewerWidth / 2 + x - player.x, Settings.ViewerHeight / 2 + y - player.y, tiles[y][x], [255, 255, 255]);
	}
	
	// Generate map
	for (var y = 0; y < height; y++) {
		tiles[y] = [];
		for (var x = 0; x < width; x++) {
			tiles[y][x] = '.';
		}
	}
	// Insert player
	creatures[0] = player;
	creatureMap[[player.x, player.y]] = player;
	
	return {
		width: width,
		height: height,
		tiles: tiles,
		draw: draw,
		creatureMap: creatureMap
	}
}
