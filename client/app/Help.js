'use strict';

define([], function() {
    var show = function() {
	    //TODO: Needs refactor / add a client JS framework.
        var helpPanel = document.getElementsByClassName(constants.ui.HELP_PANEL)[0];
	    helpPanel.style.display = 'block';
    };

	var hide = function() {
		//TODO: Needs refactor / add a client JS framework.
		var helpPanel = document.getElementsByClassName(constants.ui.HELP_PANEL)[0];
		helpPanel.style.display = 'none';
	};

    return {
        show: show,
		hide: hide
    };
});
