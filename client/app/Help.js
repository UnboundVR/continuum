'use strict';

define(['text!assets/html/Help.html', 'text!assets/css/Help.css', 'utils/BuildHTMLNode', 'i18n!nls/Help', 'API', 'Auth'], function(html, css, buildHTMLNode, i18n, api, auth) {
    var container;
    var helpPanel;

    var show = function() {
        helpPanel.style.display = 'block';
    };

    var hide = function() {
        helpPanel.style.display = 'none';
    };

    var showAtStart = function(value) {
        var payload = {
            displayHelpAtStartup: value
        };
        api.changeUserMetadata(payload);
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

        var showAtStartupCheckbox = document.getElementsByClassName(constants.help.SHOW_AT_STARTUP_CHECKBOX)[0];
        showAtStartupCheckbox.checked = auth.getProfile().displayHelpAtStartup;
        showAtStartupCheckbox.onchange = function(event) {
            showAtStart(showAtStartupCheckbox.checked);
        };
    };

    return {
        show: show,
        hide: hide,
        init: init
    };
});
