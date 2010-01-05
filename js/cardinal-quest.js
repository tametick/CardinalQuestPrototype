var viewer;
var cursor;
var messageLog;
var statusLines;
var state;
var player;
var maps;
var currentMap;
var debug = true;

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
		maps[currentMap].draw();
		player.draw();
		if (cursor) {
			cursor.draw();
			if (maps[currentMap].creatureMap[[cursor.x, cursor.y]]) 
				messageLog.append("You see " + maps[currentMap].creatureMap[[cursor.x, cursor.y]].description);
			else if (maps[currentMap].tiles[[cursor.x, cursor.y]].description) 
				messageLog.append("You see " + maps[currentMap].tiles[[cursor.x, cursor.y]].description);
		}
		break;
	}
	
	if (messageLog) 
		messageLog.print();
	
	if (statusLines && statusLines.print) 
		statusLines.print();
}
var save = function(){
	var properties = {
		"Maps": maps.length,
		"CurrentMap": currentMap
	};
	$.JSONCookie("cq_prop", properties, {
		path: '/'
	});
	
	for (var m = 0; m < maps.length; m++) {
		var map = {}
		var str = maps[m].stringify()
		map["Tiles"] = str[0];
		map["Creatures"] = str[1];
		$.JSONCookie("cq_map" + m, map, {
			path: '/'
		});
	}
}
var load = function(){
	alert("load");
}

$(document).ready(function(){
	$.getJSON("json/descriptions.json", function(data){
		Descriptions = data;
	});
	$.getJSON("json/keys.json", function(data){
		Keys = data;
	});
	$.getJSON("json/settings.json", function(data){
		Settings = data;
		
		state = State.Loading;
		viewer = Viewer(Settings.ViewerWidth, Settings.ViewerHeight);
		messageLog = MessageLog();
		
		state = State.Menu;
		messageLog.append("[Press space to continue]");
		update();
		
		// Must be loaded before first keydown because of $.getJSON
		maps = [Map(Settings.MapWidth, Settings.MapHeight)];
		player = Creature(Math.round((Settings.MapWidth - 1) / 2), Math.round((Settings.MapHeight - 1) / 2), '@', Descriptions.Player);
	});
	
});
$(document).keydown(function(e){
	var code = (window.event || e).keyCode;
	
	switch (state) {
	case State.Menu:
		switch (code) {
		case Keys.Space:
			currentMap = 0;
			
			statusLines = StatusLines();
			messageLog.clear();			
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
			case Keys.F2:
				if(debug)
					save();
				break;
			case Keys.F4:
				if(debug)
					load();
				break;
			}
		break;
	}
	
	update();
});
