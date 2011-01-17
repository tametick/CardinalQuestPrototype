/* 
 * Cardinal Quest
 * http://www.tametick.com/cq/
 *
 * Copyright (C) 2010, Ido Yehieli
 * Released under the GPL License:
 * http://www.gnu.org/licenses/gpl.txt
 */


var debug = true;
var utils;
var viewer;
var minimap;
var cursor;
//var currentLine;
//var currentClass;
//var currentColor;
var messageLog;
var statusLines;

var state;
var menu;
var player;
var maps;
var currentMap = 0;
var ticks;

var moved = true;

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
			//menu.draw(currentLine,currentClass, currentColor);
			menu.show();
			break;
		case State.play:
			maps[currentMap].draw();
			player.updateInventoryDialog();
			break;
		case State.examine:
			maps[currentMap].draw();
			player.updateInventoryDialog();

			cursor.draw();
			cursor.examine();

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

	var dataFiles = {
		'desc': 'json/descriptions.json',
		'creatureTypes': 'json/creature-types.json',
		'itemTypes': 'json/items.json',
		'settings': 'json/settings.json',
		'keys': 'json/keys.json',
		'sprites': 'json/sprites.json'
	};

	$(document).ajaxError(function(e, xhr, settings, exception) {
		console.log(arguments);
	});

	var loadDataFiles = function(filesToLoad, doneCallback) {
		var remaining = _.clone(filesToLoad);
		var loaded = {};

		var loadNext = function() {
			var nextKey = _.keys(remaining).pop();
			
			if (typeof(nextKey) == "undefined") {
				return doneCallback(loaded);
			}
			
			$.getJSON(remaining[nextKey], function(data) {
				loaded[nextKey] = data;
				delete remaining[nextKey];
				loadNext();
			});
		};

		loadNext();
	};
	
	loadDataFiles(dataFiles, function(data) {
		Descriptions = data.desc;
		CreatureTypes = data.creatureTypes;
		ItemTypes = data.itemTypes;
		Settings = data.settings;
		Sprites = data.sprites;

		/* Add an "image" property to each top-level entry in sprites.json */
		for (var id in Sprites) {
			var img = new Image();
			img.src = Sprites[id].src;
			Sprites[id].image = img;
		}

		$("#music_description").hide();
		$("#game_music").hide();
		$("#game_music").get()[0].addEventListener('ended', function(){
			this.currentTime = 0;
		}, false);

		utils = Utils();
		var itemIds = [];
		for(var id in ItemTypes)
			itemIds.push(id);
		ItemTypes["ids"]=itemIds;
	
		state = State.loading;
		viewer = Viewer(Settings.viewerWidth, Settings.viewerHeight);
		viewer.clear();
		viewer.clearLighting();

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

		Keys = data.keys;
	});

	$("#dlgHelp").dialog({
		autoOpen: false,
		modal: true,
		width: 400, height: 400
	});

	// 600x400
	$("#dlgInventory").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		width: 650, height: 350
	});

	$("#btnHelp")
		.button()
		.click(function() {
			$("#dlgHelp").dialog('open');
		})
		.show();

	$("#btnInventory")
		.button()
		.click(function() {
			$("#dlgInventory").dialog('open');
		});
	
	var gameMusic = $("#game_music").get(0);
	$("#musicPlay")
		.button({
			text: false,
			icons: { primary: "ui-icon-play" }
		})
		.click(function() {
			if ( $(this).button("option", "icons").primary == "ui-icon-play" ) {
				$(this).button("option", "icons", { primary: "ui-icon-pause" });
				gameMusic.play();
			} else {
				$(this).button("option", "icons", { primary: "ui-icon-play" });
				gameMusic.pause();
			}
		})
		.show();

	var oldVolume = 10;
	$("#volumeToggle")
		.button({
			text: false,
			icons: { primary: "ui-icon-volume-on" }
		})
		.click(function() {
			if ( $(this).button("option", "icons").primary == "ui-icon-volume-on" ) {
				oldVolume = $("#volumeSlider").slider("value");
				$("#volumeSlider").slider("value", 0);
				$(this).button("option", "icons", { primary: "ui-icon-volume-off" });
			} else {
				$("#volumeSlider").slider("value", oldVolume);
				$(this).button("option", "icons", { primary: "ui-icon-volume-on" });
			}
		})
		.show();

	$("#volumeSlider").slider({
		value: 10,
		step: 1,
		min: 0,
		max: 10,
		range: "min",
		animate: true,
		change: function(event, ui) {
			var vol = ui.value / 10;
			$("audio").each(function(idx) {
				$(this).get(0).volume = vol;
			});
		}
	});

	$("#createQuest input:radio[name=charQuest]").change(function() { menu.update(); });

	$("#btnPlay")
		.button()
		.click(function() {
			startGame();
		})
		.show();
	
	$("#charName").alphanumeric();
});

function startGame() {
	var name = $("#charName").val();
	if ( typeof name === "undefined" || name == '' ) name = "Hero";
	var selectedClass = $("#createQuest input:radio[name=charQuest]:checked").val();
	var selectedColor = $("#createColor input:radio[name=charColor]:checked").val();
	player.name = name;
	player.charClassId = CharClassId[selectedClass];
	currentMap = 0;
	ticks = 0;
	messageLog.clear();
	maps[0].generateRandom();
	player.init();
	player.calculateFieldOfView();
	player.vars.color = player.color = ColorId[selectedColor];
	state = State.play;
	$("#music_description").show();
	$("#game_music").show();
	$("#messageLog").show();
	if( !debug ) {
		$("#game_music").get()[0].play();
	}
	menu.hide();
	update();
}

$(document).keydown(function(e){
	if(e.altKey || e.ctrlKey || e.metaKey) 
		return;
	
	if ( state == State.menu ) return;

	var code = (window.event || e).keyCode;
	
	switch (state) {
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
				case Keys.enter:
					cursor.vars.detailed = true;
					break;
				case Keys.x:
				case Keys.esc:
					cursor = null;
					state = State.play;
					break;
			}
			break;
		case State.play:
			// The player gets the first move in the game for free
			switch (code) {
				case Keys.numUp:
				case Keys.up:
				case Keys.w:	
					moved = player.move(0, -1);
					break;
				case Keys.numDown:
				case Keys.down:
				case Keys.s:
					moved = player.move(0, 1);
					break;
				case Keys.numLeft:
				case Keys.left:
				case Keys.a:
					moved = player.move(-1, 0);
					break;
				case Keys.numRight:
				case Keys.right:
				case Keys.d:
					moved = player.move(1, 0);
					break;
				case Keys["."]:
				case Keys.q:
					moved = true;
					break;
/*				case Keys.x:
					cursor = Cursor(player.vars.x, player.vars.y, '?');
					state = State.examine;
					moved = false;
					break;
				case Keys.c:
					moved = player.closeDoor();
					break;*/
				case Keys.e:
					moved = player.executeSpecial();
					break;
				case Keys.i:
				case Keys.space:
					/*
					state = State.inventory;
					currentLine = 0;
					moved = false;
					*/
					if ( $("#dlgInventory").dialog("isOpen") ) {
						$("#dlgInventory").dialog("close");
					} else {
						$("#dlgInventory").dialog("open");
					}
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
