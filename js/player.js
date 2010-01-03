var Player = function(startX, startY){
	var x = startX;
	var y = startY;
	var symbol = '@';
	var viewerCenter = [Settings.ViewerWidth / 2, Settings.ViewerHeight / 2];
	
	var draw = function(){
		viewer.putTile(viewerCenter[0], viewerCenter[1], player.symbol, Settings.PlayerColor);
	}
	
	return {
		x: x,
		y: y,
		symbol: symbol,
		draw: draw
	}
}
