/* 
 * Cardinal Quest
 * http://www.tametick.com/cq/
 *
 * Copyright (C) 2010, Ido Yehieli
 * Released under the GPL License:
 * http://www.gnu.org/licenses/gpl.txt
 */
 
 
 var Menu = function(){

	var show = function() {
		if ( $("#charCreate").is(":visible") ) return;
		$("#btnInventory").hide();
		$("#charCreate").show();
		updateMenu();
	}

	var hide = function() {
		$("#charCreate").hide();
		$("#btnInventory").show();
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
		show: show,
		hide: hide,
		update: updateMenu
	}
}
