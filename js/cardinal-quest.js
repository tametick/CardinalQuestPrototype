var viewer;
var state;
var player;
var messageLog;
var statusLines;

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

var update = function(){
	viewer.clear();
	switch (state) {
	case State.Menu:
		break;
	case State.Play:
		viewer.putTile(player.x, player.y, player.symbol, [0, 0, 255]);
		break;
	}
	
	messageLog.print();
	if(statusLines)
		statusLines.print();
}

$(document).ready(function(){
	state = State.Loading;
	viewer = Viewer(20, 10);
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
			statusLines = StatusLines(player);
			
			messageLog.clear();
			messageLog.append("str 1");
			messageLog.append("str 2");
			
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
