var debug = true;
var utils;

var viewer;
var cursor;
var messageLog;
var statusLines;

var state;
var player;
var maps;
var currentMap;
var ticks;

var moved = true;

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
		if (cursor) {
			cursor.draw();
			if (maps[currentMap].vars.creatureMap[[cursor.vars.x, cursor.vars.y]]) 
				messageLog.append("You see " + maps[currentMap].vars.creatureMap[[cursor.vars.x, cursor.vars.y]].vars.description);
			else if (maps[currentMap].tiles[[cursor.vars.x, cursor.vars.y]].description) 
				messageLog.append("You see " + maps[currentMap].tiles[[cursor.vars.x, cursor.vars.y]].description);
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
		"CurrentMap": currentMap,
		"Ticks": ticks
	};
	$.JSONCookie("cq_prop", properties, {
		path: '/'
	});
	
	for (var m = 0; m < maps.length; m++) {
		var map = {}
		map["Width"] = maps[m].width;
		map["Height"] = maps[m].height;
		var str = maps[m].stringify()
		map["Tiles"] = str[0];
		map["Creatures"] = str[1];
		$.JSONCookie("cq_map" + m, map, {
			path: '/'
		});
	}
}
var load = function(){
	var properties = $.JSONCookie("cq_prop");
	var numberOfMaps = properties["Maps"];
	currentMap = properties["CurrentMap"];
	ticks = properties["Ticks"];
	
	maps = [];
	for (var m = 0; m < numberOfMaps; m++) {
		var map = $.JSONCookie("cq_map" + m);
		maps[m] = Map(map["Width"],	map["Height"]);
		maps[m].parse(map["Tiles"], map["Creatures"]);
	}
	
	player = maps[numberOfMaps - 1].vars.creatures[0];
	messageLog.clear();
}

$(document).ready(function(){
	$.getJSON("json/descriptions.json", function(desc){
		$.getJSON("json/creature-types.json", function(types){
			$.getJSON("json/settings.json", function(sett){
				Descriptions = desc;
				CreatureTypes = types;
				Settings = sett;
				
				utils = Utils();
				
				state = State.Loading;
				viewer = Viewer(Settings.viewerWidth, Settings.viewerHeight);
				messageLog = MessageLog();
				statusLines = StatusLines();
				
				state = State.Menu;
				messageLog.append("[Press space to continue]");
				update();
				
				// FIXME: Must be loaded before first keydown because of $.getJSON
				$.getJSON("json/map.json", function(mapData){
					maps = [Map(mapData["width"],mapData["height"])];
					player = Creature(Math.round((maps[0].width - 1) / 2), Math.round((maps[0].height - 1) / 2), '@');
					
					maps[0].generate(mapData);
					player.init();
				});		
			});
		});
	});
	$.getJSON("json/keys.json", function(data){
		Keys = data;
	});
});
$(document).keydown(function(e){
	var code = (window.event || e).keyCode;
	
	switch (state) {
	case State.Menu:
		switch (code) {
		case Keys.space:
			currentMap = 0;
			ticks = 0;
			
			messageLog.clear();			
			state = State.Play;
			break;
		}
		break;
	case State.Play:
		if(cursor)
			switch (code) {
			case Keys.up:
				cursor.move(0, -1);
				break;
			case Keys.down:
				cursor.move(0, 1);
				break;
			case Keys.left:
				cursor.move(-1, 0);
				break;
			case Keys.right:
				cursor.move(1, 0);
				break;
			case Keys.l:
				cursor = null;
				break;
			case Keys.esc:
				if(cursor)
					cursor = null;
			}
		else {
			// The player gets the first move in the game for free		
			switch (code) {
			case Keys.up:
				moved = player.move(0, -1);
				break;
			case Keys.down:
				moved = player.move(0, 1);
				break;
			case Keys.left:
				moved = player.move(-1, 0);
				break;
			case Keys.right:
				moved = player.move(1, 0);
				break;
			case Keys.l:
				cursor = Cursor(player.vars.x, player.vars.y, '?');
				break;
			case Keys.c:
				moved = player.closeDoor();
				break;
			case Keys.f2:
				if (debug)
					save();
				break;
			case Keys.f4:
				if (debug)
					load();
				break;
			}
			
			if (moved) {
				player.vars.actionPoints = 0;
				while (player.vars.actionPoints < 60) {
					maps[currentMap].tick();
					ticks++;
				}
				moved = false;
			}
		}
		break;
	}
	
	update();
});
