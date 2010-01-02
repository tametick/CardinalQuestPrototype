var scr;
var stt;
var plr;
var msgLog;

var Player = function(startX, startY){
	var x = startX;
	var y = startY;
	var symbol = '@';
	
	return {
		x: x,
		y: y,
		symbol: symbol
	}
}
var drawScreen = function(){
	scr.clear();
	switch (stt) {
	case State.Menu:
		scr.drawTile(0, scr.height - 1, "[Press any key to continue]", [240, 240, 240]);
		break;
	case State.Play:
		scr.drawTile(plr.x, plr.y, plr.symbol, [0, 0, 255]);
		break;
	}
}
var Keys = {
	Space: 32,
	Up: 38,
	Down: 40,
	Left: 37,
	Right: 39
}

$(document).ready(function(){
	stt = State.Loading;
	scr = Screen(20, 10);
	
	stt = State.Menu;
	drawScreen();
});
$(document).keydown(function(e){
	var e = window.event || e;
	var code = e.keyCode;
	
	switch (stt) {
	case State.Menu:
		switch (code) {
		case Keys.Space:
			plr = Player(scr.width / 2, scr.height / 2);
			msgLog = MessageLog();
			stt = State.Play;
			break;
		}
		break;
	case State.Play:
		switch (code) {
		case Keys.Up:
			plr.y--;
			break;
		case Keys.Down:
			plr.y++;
			break;
		case Keys.Left:
			plr.x--;
			break;
		case Keys.Right:
			plr.x++;
			break;
		}
		break;
	}
	
	// Update screen after every key-press
	drawScreen();
});
