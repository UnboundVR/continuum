var consts = require('../../../shared/constants');
var events = require('../Events');
var pointerLock = require('../PointerLock');

// TODO migrate html, i18n

var init = function() {
    var container = document.getElementById(consts.ui.UI_CONTAINER);
    container.appendChild(html);

    var pointerLockButton = container.getElementsByClassName(consts.ui.actions.POINTER_LOCK_BUTTON)[0];
    pointerLockButton.setAttribute('title', i18n.lockCursor);
    pointerLockButton.onclick = function() {
        pointerLock.lockCursor();
    };

    var logoutButton = container.getElementsByClassName(consts.ui.actions.LOGOUT_BUTTON)[0];
    logoutButton.setAttribute('title', i18n.logout);
    logoutButton.onclick = function() {
        events.dispatch(consts.events.LOGOUT);
    };

    var helpButton = container.getElementsByClassName(consts.ui.actions.HELP_BUTTON)[0];
    helpButton.setAttribute('title', i18n.help);
    helpButton.onclick = function() {
        events.dispatch(consts.events.SHOW_HELP, true);
        events.dispatch(consts.events.SHOW_SETTINGS, false);
    };

    var settingsButton = container.getElementsByClassName(consts.ui.actions.SETTINGS_BUTTON)[0];
    settingsButton.setAttribute('title', i18n.settings);
    settingsButton.onclick = function() {
        events.dispatch(consts.events.SHOW_SETTINGS, true);
        events.dispatch(consts.events.SHOW_HELP, false);
    };
};

module.exports = {
    init: init
};
