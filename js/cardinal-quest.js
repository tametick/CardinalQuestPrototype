var scr;
var stt;
$(document).ready(function(){
	stt = State.Loading;
	scr = Screen(20, 10);
	
	stt = State.Menu;
	scr.drawTile(0, 0, "Cardinal Quest", [240, 240, 240]);
	scr.drawTile(0, scr.height - 1, "[Press any key to continue]", [240, 240, 240]);
	
	stt = State.Play;
});
