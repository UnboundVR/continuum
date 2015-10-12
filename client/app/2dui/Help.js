var consts = require('../../../shared/constants');
var events = require('../Events');
var settings = require('../utils/Settings');

// TODO migrate html, i18n

var helpPanel;
var container;

var show = function() {
    html.style.display = 'block';
};

var hide = function() {
    html.style.display = 'none';
};

var configShowAtStartup = function() {
    var displayAtStartup = settings.get(consts.settings.DISPLAY_HELP_AT_STARTUP);

    var showAtStartupCheckbox = container.getElementsByClassName(consts.ui.help.SHOW_AT_STARTUP_CHECKBOX)[0];
    showAtStartupCheckbox.checked = displayAtStartup;
    showAtStartupCheckbox.onchange = function(event) {
        settings.set(consts.settings.DISPLAY_HELP_AT_STARTUP, showAtStartupCheckbox.checked);
    };

    if (!displayAtStartup) {
        hide();
    }
};

var init = function() {
    container = document.getElementById(consts.ui.UI_CONTAINER);
    container.appendChild(html);

    var lockCursorHelp = container.getElementsByClassName(consts.ui.help.LOCK_CURSOR)[0];
    lockCursorHelp.innerHTML = i18n.lockCursor;

    var keysHelp = container.getElementsByClassName(consts.ui.help.KEYS)[0];
    keysHelp.innerHTML = i18n.keys;

    var closeButton = html.getElementsByClassName(consts.ui.CLOSE_BUTTON)[0];
    closeButton.onclick = hide;

    configShowAtStartup();

    events.subscribe(consts.events.SHOW_HELP, function(display) {
        (display ? show : hide)();
    });
};

module.exports = {
    show: show,
    hide: hide,
    init: init
};
