var Tile = function(symbol, description){
	return {
		symbol: symbol,
		description: description
	}
}

var Map = function(width, height){
	var tiles = [];
	var creatures = [];
	var creatureMap = [];
	var viewerCenter = [Settings.ViewerWidth / 2, Settings.ViewerHeight / 2];
	
	// Draw the map around the player
	draw = function(){
		for (var x = 0; x < width; x++) 
			for (var y = 0; y < height; y++) 
				if (creatureMap[[x, y]] == null) 
					viewer.putTile(Settings.ViewerWidth / 2 + x - player.x, Settings.ViewerHeight / 2 + y - player.y, tiles[[x, y]].symbol, [200, 200, 200]);
	}
	
	// Generate map
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			if (x == 0 || y == 0 || x == width - 1 || y == height - 1) 
				tiles[[x, y]] = Tile('#', Descriptions.Wall);
			else if (Math.random() < 0.1) 
				tiles[[x, y]] = Tile('+', Descriptions.Door);
			else 
				tiles[[x, y]] = Tile('.', null);
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
