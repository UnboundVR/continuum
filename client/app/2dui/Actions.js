var consts = require('../../../shared/constants');
var events = require('../Events');
var pointerLock = require('../PointerLock');
var i18n = require('../translations/Polyglot');

var buildHTMLNode = require('../utils/BuildHTMLNode');
var html = require('../../../assets/html/Actions.html')
var css = require('../../../assets/html/Actions.css');
var htmlNode = buildHTMLNode(html, css);

var init = function() {
    var container = document.getElementById(consts.ui.UI_CONTAINER);
    container.appendChild(htmlNode);

    var pointerLockButton = htmlNode.getElementsByClassName(consts.ui.actions.POINTER_LOCK_BUTTON)[0];
    pointerLockButton.setAttribute('title', i18n.t('actions.lockCursor');
    pointerLockButton.onclick = function() {
        pointerLock.lockCursor();
    };

    var logoutButton = htmlNode.getElementsByClassName(consts.ui.actions.LOGOUT_BUTTON)[0];
    logoutButton.setAttribute('title', i18n.t('actions.logout');
    logoutButton.onclick = function() {
        events.dispatch(consts.events.LOGOUT);
    };

    var helpButton = htmlNode.getElementsByClassName(consts.ui.actions.HELP_BUTTON)[0];
    helpButton.setAttribute('title', i18n.t('actions.help');
    helpButton.onclick = function() {
        events.dispatch(consts.events.SHOW_HELP, true);
        events.dispatch(consts.events.SHOW_SETTINGS, false);
    };

    var settingsButton = htmlNode.getElementsByClassName(consts.ui.actions.SETTINGS_BUTTON)[0];
    settingsButton.setAttribute('title', i18n.t('actions.settings');
    settingsButton.onclick = function() {
        events.dispatch(consts.events.SHOW_SETTINGS, true);
        events.dispatch(consts.events.SHOW_HELP, false);
    };
};

module.exports = {
    init: init
};
