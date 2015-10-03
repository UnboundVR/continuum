'use strict';

define(['text!assets/html/Help.html', 'text!assets/css/Help.css', 'utils/BuildHTMLNode', 'i18n!nls/Help'], function(html, css, buildHTMLNode, i18n) {
    var container;
    var helpPanel;

    var show = function() {
	    helpPanel.style.display = 'block';
    };

	var hide = function() {
		helpPanel.style.display = 'none';
	};

    var init = function() {
        container = document.getElementById(constants.ui.UI_CONTAINER);
        var element = buildHTMLNode(html, css);
        container.appendChild(element);
        helpPanel = container.getElementsByClassName(constants.help.HELP_PANEL)[0];

        var lockCursorHelp = container.getElementsByClassName(constants.help.LOCK_CURSOR)[0];
        lockCursorHelp.innerHTML = i18n.lockCursor;

        var keysHelp = container.getElementsByClassName(constants.help.KEYS)[0];
        keysHelp.innerHTML = i18n.keys;

		var closeButton = container.getElementsByClassName(constants.help.CLOSE_BUTTON)[0];
		closeButton.onclick = hide;
    };

    return {
        show: show,
		hide: hide,
        init: init
    };
});
