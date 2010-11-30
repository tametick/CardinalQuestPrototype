/* 
 * Cardinal Quest
 * http://www.tametick.com/cq/
 *
 * Copyright (C) 2010, Ido Yehieli
 * Released under the GPL License:
 * http://www.gnu.org/licenses/gpl.txt
 */
 
 
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
				viewer.print(1, line++, "", [255, 255, 255]);
				viewer.print(1, line++, "Special move:", [255, 255, 255]);
				viewer.print(1, line++, "Berserk", [128, 0, 128]);
			} else if (currentClass == 1) {
				viewer.print(8, line++, ">", [0, 200, 200]);
				line++;
				viewer.print(1, line++, "To raid, pillage, plunder", [255, 255, 255]);
				viewer.print(1, line++, "and otherwise pilfer my", [255, 255, 255]);
				viewer.print(1, line++, "weaselly black guts out.", [255, 255, 255]);
				viewer.print(1, line++, "", [255, 255, 255]);
				viewer.print(1, line++, "Special move:", [255, 255, 255]);
				viewer.print(1, line++, "Shadow Walk", [128, 0, 128]);
			} else if (currentClass == 2) {
				viewer.print(13, line++, ">", [0, 200, 200]);
				line++;
				viewer.print(1, line++, "I...am an enchanter.", [255, 255, 255]);
				viewer.print(1, line++, "There are some who call me...", [255, 255, 255]);
				viewer.print(1, line++, player.name+".", [255, 255, 255]);
				viewer.print(1, line++, "", [255, 255, 255]);
				viewer.print(1, line++, "Special move:", [255, 255, 255]);
				viewer.print(1, line++, "Fire Nova", [128, 0, 128]);
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

	var show = function() {
		if ( $("#charCreate").is(":visible") ) return;
		$("#charCreate").show();
		updateMenu();
	}

	var hide = function() {
		$("#charCreate").hide();
	}

	var updateMenu = function() {
		var selectedClass = $("#createQuest input:radio[name=charQuest]:checked").val();
		var classDesc = $("#createQuest #questDesc");
		var classPic = $("#questPic");
		classDesc.empty();
		var str = '';
		switch (selectedClass) {
			case '0':
				//str = "To crush my enemies,<br />see them driven before me,<br />and to hear the lamentation<br />of their women.<br /><br />";
				str = "To crush my enemies, see them driven before me, and to hear the lamentation of their women.<br /><br />";
				str += "Special move:<br /><b style='color:#f5f;'>Berserk</b>";
				classPic.css('backgroundPosition', '-32px 0px');
				break;
			case '1':
				//str = "To raid, pillage, plunder<br />and otherwise pilfer my<br />weaselly black guts out.<br /><br />";
				str = "To raid, pillage, plunder and otherwise pilfer my weaselly black guts out.<br /><br />";
				str += "Special move:<br /><b style='color:#f5f;'>Shadow Walk</b>";
				classPic.css('backgroundPosition', '-96px 0px');
				break;
			case '2':
				//str = "I...am an enchanter.<br />There are some who call me...<br />Tim?<br /><br />";
				str = "I... am an enchanter. There are those who call me... Tim?<br /><br />";
				str += "Special move:<br /><b style='color:#f5f;'>Fire Nova</b>";
				classPic.css('backgroundPosition', '-64px 0px');
				break;
		}
		classDesc.html(str);
	}

	return {
		draw: draw,
		show: show,
		hide: hide,
		update: updateMenu
	}
}
