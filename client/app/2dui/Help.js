'use strict';

define(['text!assets/html/Help.html', 'text!assets/css/Help.css', 'utils/BuildHTMLNode', 'i18n!nls/Help', 'API', 'Auth', 'Events'], function(html, css, buildHTMLNode, i18n, api, auth, events) {
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

    var configShowAtStartup = function() {
        var displayAtStartup = true;
        var profile = auth.getProfile();

        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

        if (profile.user_metadata && profile.user_metadata.displayHelpAtStartup !== undefined) {
            displayAtStartup = profile.user_metadata.displayHelpAtStartup;
        };

        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

        var showAtStartupCheckbox = document.getElementsByClassName(constants.ui.help.SHOW_AT_STARTUP_CHECKBOX)[0];

        showAtStartupCheckbox.checked = displayAtStartup;
        if(!displayAtStartup) {
            hide();
        }

        showAtStartupCheckbox.onchange = function(event) {
            showAtStart(showAtStartupCheckbox.checked);
        };
    }

    var init = function() {
        var container = document.getElementById(constants.ui.UI_CONTAINER);
        var element = buildHTMLNode(html, css);
        container.appendChild(element);
        helpPanel = container.getElementsByClassName(constants.ui.help.HELP_PANEL)[0];

        var lockCursorHelp = container.getElementsByClassName(constants.ui.help.LOCK_CURSOR)[0];
        lockCursorHelp.innerHTML = i18n.lockCursor;

        var keysHelp = container.getElementsByClassName(constants.ui.help.KEYS)[0];
        keysHelp.innerHTML = i18n.keys;

        var closeButton = container.getElementsByClassName(constants.ui.help.CLOSE_BUTTON)[0];
        closeButton.onclick = hide;

        configShowAtStartup();

        events.subscribe(events.list.showhelp, show);
    };

    return {
        show: show,
        hide: hide,
        init: init
    };
});
