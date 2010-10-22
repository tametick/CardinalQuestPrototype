var debug = true;
var utils;

var viewer;
var minimap;
var cursor;
var currentLine;
var currentClass;
var currentColor;
var messageLog;
var statusLines;

var state;
var menu;
var player;
var maps;
var currentMap = 0;
var ticks;

var moved = true;

Pics = {
	'player' : new Image(),
	'tiles' : new Image(),
	'items' : new Image()
}

var State = {
	loading: 0,
	menu: 1,
	play: 2,
	examine: 3,
	inventory: 4,
	equipment: 5
}

var CharClassId = {
	0: "@f",
	1: "@t",
	2: "@w"
}
var ColorId = {
	0: [0, 200, 0],
	1: [0, 0, 200],
	2: [200, 200, 0]
}

var update = function(){
	viewer.clear();
	var emptyStatus = false;
	
	switch (state) {
	case State.menu:
		emptyStatus = true;
		menu.draw(currentLine,currentClass, currentColor);
		break;
	case State.play:
		maps[currentMap].draw();
		player.vars.inventory.print();
		player.vars.equipment.print();
		player.vars.weapon.print();
		break;
	case State.examine:
		maps[currentMap].draw();
		player.vars.inventory.print();
		player.vars.equipment.print();
		player.vars.weapon.print();
		cursor.draw();
		if (maps[currentMap].vars.creatureMap[[cursor.vars.x, cursor.vars.y]]) 
			messageLog.append("You see " + maps[currentMap].vars.creatureMap[[cursor.vars.x, cursor.vars.y]].vars.description[0]);
		else if (maps[currentMap].vars.itemMap[[cursor.vars.x, cursor.vars.y]]) 
			messageLog.append("You see " + maps[currentMap].vars.itemMap[[cursor.vars.x, cursor.vars.y]].vars.description[0]);
		else if (maps[currentMap].tiles[[cursor.vars.x, cursor.vars.y]].description) 
			messageLog.append("You see " + maps[currentMap].tiles[[cursor.vars.x, cursor.vars.y]].description[0]);

		break;
	case State.inventory:
		maps[currentMap].draw();
		player.vars.inventory.print(currentLine);
		player.vars.equipment.print();
		player.vars.weapon.print();
		break;
	case State.equipment:
		maps[currentMap].draw();
		player.vars.inventory.print();
		player.vars.equipment.print(currentLine);
		player.vars.weapon.print();
		break;
	}
	
	if (messageLog) 
		messageLog.print();
	
	if (statusLines && statusLines.print) 
		statusLines.print(emptyStatus);
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
		map["Items"] = str[2];
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
		maps[m] = Map(map["Width"], map["Height"]);
		maps[m].parse(map["Tiles"], map["Creatures"],map["Items"]);
	}
	
	player = maps[numberOfMaps - 1].vars.creatures[0];
	messageLog.clear();
}

$(function() {
	$.getJSON("json/descriptions.json", function(desc){
		$.getJSON("json/creature-types.json", function(creatureTypes){
			$.getJSON("json/items.json", function(itemTypes){
				$.getJSON("json/settings.json", function(sett){
					Pics.player.src = 'pics/player.png';
					Pics.tiles.src = 'pics/tiles-big.png';
					Pics.items.src = 'pics/items.png';
					
					Descriptions = desc;
					CreatureTypes = creatureTypes;
					ItemTypes = itemTypes;
					Settings = sett;
					
					utils = Utils();
					var itemIds = [];
					for(var id in ItemTypes)
						itemIds.push(id);
					ItemTypes["ids"]=itemIds;
					
					state = State.loading;
					viewer = Viewer(Settings.viewerWidth, Settings.viewerHeight);
					viewer.clear();
					minimap = new Minimap();
					minimap.clear();
					messageLog = MessageLog();
					statusLines = StatusLines();
					
					state = State.menu;
					currentLine = 0;
					currentClass = 0;
					currentColor = 0;
					menu = Menu();
					
					update();
					
					maps = [Map(Settings["mapWidth"], Settings["mapHeight"])];
					player = Creature(utils.randInt(1,maps[0].width-2), utils.randInt(1,maps[0].height-2), '@');
					player.name = "";
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
	case State.menu:
		player.charClassId = CharClassId[currentClass];
		player.color = ColorId[currentColor];
		
		document.defaultAction = false;
		switch (code) {
		case Keys.numUp:
		case Keys.up:
			if(currentLine>0)
				currentLine--;
			break;
		case Keys.numDown:
		case Keys.down:
		case Keys.enter:
			if(currentLine<2)
				currentLine++;
			else {
				currentMap = 0;
				ticks = 0;
				messageLog.clear();
				maps[0].generateRandom();
				player.init();
				player.calculateFieldOfView();
				state = State.play;
				document.defaultAction = true;
			}
			break;		
		case Keys.backspace:
			if(currentLine == 0 && player.name.length > 0)
				player.name = player.name.substring(0, player.name.length-1);
			break;
		case Keys.numLeft:
		case Keys.left:
			if (currentLine == 1) {
				currentClass--;
			} else if (currentLine == 2) {
				currentColor--;
			}
			break;
		case Keys.numRight:
		case Keys.right:
			if (currentLine == 1) {
				currentClass++;
			} else if (currentLine == 2) {
				currentColor++;
			}
			break;
		default:
			if(currentLine==0)
				player.name += utils.alphanumeric(code);
				player.name = utils.capitalize(player.name);
			break;
		}
		 
		break;
	case State.examine:
		switch (code) {
		case Keys.numUp:
		case Keys.up:
			cursor.move(0, -1);
			break;
		case Keys.numDown:
		case Keys.down:
			cursor.move(0, 1);
			break;
		case Keys.numLeft:
		case Keys.left:
			cursor.move(-1, 0);
			break;
		case Keys.numRight:
		case Keys.right:
			cursor.move(1, 0);
			break;
		case Keys.x:
		case Keys.esc:
			cursor = null;
			state = State.play;
			break;
		}
	break;
	case State.inventory:
		switch (code) {
		case Keys.numUp:
		case Keys.up:
			currentLine--;
			break;
		case Keys.numDown:
		case Keys.down:
			currentLine++;
			break;
		case Keys.numRight:
		case Keys.right:
		case Keys.enter:
			player.use(currentLine);
			state = State.play;
			break;
		case Keys.numLeft:
		case Keys.left:
		case Keys.d:
			player.drop(currentLine);
			state = State.play;
			break;
		case Keys.i:
		case Keys.esc:
			state = State.play;
			break;
		}
	break;
	case State.play:
		// The player gets the first move in the game for free		
		switch (code) {
		case Keys.numUp:
		case Keys.up:
			moved = player.move(0, -1);
			break;
		case Keys.numDown:
		case Keys.down:
			moved = player.move(0, 1);
			break;
		case Keys.numLeft:
		case Keys.left:
			moved = player.move(-1, 0);
			break;
		case Keys.numRight:
		case Keys.right:
			moved = player.move(1, 0);
			break;
		case Keys["."]:
			moved = true;
			break;
		case Keys.x:
			cursor = Cursor(player.vars.x, player.vars.y, '?');
			state = State.examine;
			moved = false;
			break;
		case Keys.c:
			moved = player.closeDoor();
			break;
		case Keys.e:
			moved = player.executeSpecial();
			break;
		case Keys.i:
			state = State.inventory;
			currentLine = 0;
			moved = false;
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
			player.calculateFieldOfView();
			player.vars.actionPoints = 0;
			while (player.vars.actionPoints < 60) {
				var continueTicking = maps[currentMap].tick();
				ticks++;
				if(!continueTicking)
					break;
			}
			moved = false;
		}
		break;
	}
	
	update();
	return false;
});
