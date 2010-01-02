var scr;
var stt;

var Keys = {
	Space: 32
}
var drawScreen = function(){
	scr.clear();
	switch (stt) {
	case State.Menu:
		scr.drawTile(0, scr.height - 1, "[Press any key to continue]", [240, 240, 240]);
		break;
	case State.Play:
		break;
	}
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
			stt = State.Play;
			break;
		}
		break;
	case State.Play:
		switch (code) {
		}
		break;
	}
	
	// Update screen after every key-press
	drawScreen();
});
