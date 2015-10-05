'use strict';

define(['text!assets/html/Actions.html', 'text!assets/css/Actions.css', 'utils/BuildHTMLNode', 'i18n!nls/Actions', 'Events', 'PointerLock'], function(html, css, buildHTMLNode, i18n, events, pointerLock) {
    var init = function() {
        var container = document.getElementById(constants.ui.UI_CONTAINER);
        var element = buildHTMLNode(html, css);
        container.appendChild(element);

        var loveButton = container.getElementsByClassName(constants.ui.actions.LOVE_BUTTON)[0];
        loveButton.setAttribute('title', i18n.love);
        loveButton.onclick = function() {
            //TODO: Log that user likes demo.
        };

        var pointerLockButton = container.getElementsByClassName(constants.ui.actions.POINTER_LOCK_BUTTON)[0];
        pointerLockButton.setAttribute('title', i18n.lockCursor);
        pointerLockButton.onclick = function() {
            pointerLock.lockCursor();
        };

        var logoutButton = container.getElementsByClassName(constants.ui.actions.LOGOUT_BUTTON)[0];
        logoutButton.setAttribute('title', i18n.logout);
        logoutButton.onclick = function() {
            events.dispatch(events.list.logout);
        };

        var helpButton = container.getElementsByClassName(constants.ui.actions.HELP_BUTTON)[0];
        helpButton.setAttribute('title', i18n.help);
        helpButton.onclick = function() {
            events.dispatch(events.list.showhelp);
        };
    };

    return {
        init: init
    };
});
