var scr;
var stt;
$(document).ready(function(){
	stt = State.Loading;
	scr = Screen(20, 10);
	
	stt = State.Menu;
	scr.drawTile(0, 0, "Hello canvas world!", [240, 240, 240]);
	
	stt = State.Play;
});