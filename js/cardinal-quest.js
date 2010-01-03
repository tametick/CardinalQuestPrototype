var viewer;
var messageLog;
var statusLines;
var state;
var player;
var maps;

var Keys = {
	Space: 32,
	Up: 38,
	Down: 40,
	Left: 37,
	Right: 39
}
var State = {
	Loading: 0,
	Menu: 1,
	Play: 2
}
var Settings = {
	ViewerWidth: 20,
	ViewerHeight: 10,
	MapWidth: 40,
	MapHeight: 20,
	PlayerColor: [0, 0, 255],
	LogSize: 2
}

var update = function(){
	viewer.clear();
	switch (state) {
	case State.Menu:
		break;
	case State.Play:
		viewer.putTile(player.x, player.y, player.symbol, Settings.PlayerColor);
		break;
	}
	
	if (messageLog) 
		messageLog.print();
	
	if (statusLines) 
		statusLines.print();
}

$(document).ready(function(){
	state = State.Loading;
	viewer = Viewer(Settings.ViewerWidth, Settings.ViewerHeight);
	messageLog = MessageLog();
	
	state = State.Menu;
	messageLog.append("[Press space to continue]");
	update();
});
$(document).keydown(function(e){
	var code = (window.event || e).keyCode;
	
	switch (state) {
	case State.Menu:
		switch (code) {
		case Keys.Space:
			player = Player(viewer.width / 2, viewer.height / 2);
			maps = [Map(Settings.MapWidth, Settings.MapHeight)];
			statusLines = StatusLines();
			messageLog.clear();
			
			messageLog.append("test1");
			messageLog.append("test2");
			messageLog.append("test3");
			messageLog.append("test4");
			
			state = State.Play;
			break;
		}
		break;
	case State.Play:
		switch (code) {
		case Keys.Up:
			player.y--;
			break;
		case Keys.Down:
			player.y++;
			break;
		case Keys.Left:
			player.x--;
			break;
		case Keys.Right:
			player.x++;
			break;
		}
		break;
	}
	
	update();
});
