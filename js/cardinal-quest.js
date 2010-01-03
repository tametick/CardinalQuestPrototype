var viewer;
var cursor;
var messageLog;
var statusLines;
var state;
var player;
var maps;
var currentMap;

var Keys = {
	Esc: 27,
	Space: 32,
	Up: 38,
	Down: 40,
	Left: 37,
	Right: 39,
	C: 67,
	L: 76
}
var State = {
	Loading: 0,
	Menu: 1,
	Play: 2
}
var Settings = {
	ViewerWidth: 20,
	ViewerHeight: 10,
	MapWidth: 30,
	MapHeight: 15,
	PlayerColor: [0, 0, 255],
	CursorColor: [255, 0, 0],
	LogSize: 2
}

var update = function(){
	viewer.clear();
	switch (state) {
	case State.Menu:
		break;
	case State.Play:
		maps[currentMap].draw();
		player.draw();
		if (cursor) {
			cursor.draw();
			if(maps[currentMap].creatureMap[[cursor.x,cursor.y]])
				messageLog.append("You see "+maps[currentMap].creatureMap[[cursor.x,cursor.y]].description);
			else
				messageLog.append("You see: "+maps[currentMap].tiles[[cursor.x,cursor.y]]);
		}
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
			player = Creature(Math.round((Settings.MapWidth - 1) / 2), Math.round((Settings.MapHeight - 1) / 2), '@', "yourself");
			maps = [Map(Settings.MapWidth, Settings.MapHeight)];
			currentMap = 0;
			
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
		if(cursor)
			switch (code) {
			case Keys.Up:
				cursor.move(0, -1);
				break;
			case Keys.Down:
				cursor.move(0, 1);
				break;
			case Keys.Left:
				cursor.move(-1, 0);
				break;
			case Keys.Right:
				cursor.move(1, 0);
				break;
			case Keys.L:
				cursor = null;
				break;
			case Keys.Esc:
				if(cursor)
					cursor = null;
			}
		else
			switch (code) {
			case Keys.Up:
				player.move(0, -1);
				break;
			case Keys.Down:
				player.move(0, 1);
				break;
			case Keys.Left:
				player.move(-1, 0);
				break;
			case Keys.Right:
				player.move(1, 0);
				break;
			case Keys.L:
				cursor = Cursor(player.x, player.y, '?');
				break;
			case Keys.C:
				player.closeDoor();
				break;
			}
		break;
	}
	
	update();
});
