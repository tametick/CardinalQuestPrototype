var Menu = function(){
	var draw = function(currentLine, currentClass, currentColor){
		line = 1;
		viewer.print(1, line++, "What is your name?", [200, 200, 200]);
		if (player) 
			viewer.print(1, line++, " " + player.name, [200, 200, 200]);
		line++;
		if (currentLine >= 1) {
			viewer.print(1, line++, "What is your quest?", [200, 200, 200]);
			viewer.print(2, line, "Fighter", [200, 200, 200]);
			viewer.print(9, line, "Thief", [200, 200, 200]);
			viewer.print(14, line, "Wizard", [200, 200, 200]);
			if (currentClass == 0) {
				viewer.print(1, line++, ">", [0, 200, 200]);
				line++;
				viewer.print(1, line++, "To crush my enemies,", [255, 255, 255]);
				viewer.print(1, line++, "see them driven before me,", [255, 255, 255]);
				viewer.print(1, line++, "and to hear the lamentation", [255, 255, 255]);
				viewer.print(1, line++, "of their women.", [255, 255, 255]);
			} else if (currentClass == 1) {
				viewer.print(8, line++, ">", [0, 200, 200]);
				line++;
				viewer.print(1, line++, "To raid, pillage, plunder", [255, 255, 255]);
				viewer.print(1, line++, "and otherwise pilfer my", [255, 255, 255]);
				viewer.print(1, line++, "weaselly black guts out.", [255, 255, 255]);
			} else if (currentClass == 2) {
				viewer.print(13, line++, ">", [0, 200, 200]);
				line++;
				viewer.print(1, line++, "I... am an enchanter.", [255, 255, 255]);
				viewer.print(1, line++, "There are some who call me...", [255, 255, 255]);
				viewer.print(1, line++, player.name+".", [255, 255, 255]);
			}
		}
		if (currentLine >= 2) {
			line++;
			viewer.print(1, line++, "What is your favorite color?", [200, 200, 200]);
			viewer.print(2, line, "Green", [0, 200, 0]);
			viewer.print(9, line, "Blue", [0, 0, 200]);
			viewer.print(14, line, "Yellow", [200, 200, 0]);
			if (currentColor == 0) 
				viewer.print(1, line, ">", [0, 200, 200]);
			else if (currentColor == 1) 
				viewer.print(8, line, ">", [0, 200, 200]);
			else if (currentColor == 2) 
				viewer.print(13, line, ">", [0, 200, 200]);			
		}
	}
	return {
		draw: draw
	}
}
