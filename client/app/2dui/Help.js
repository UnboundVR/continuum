var consts = require('../../../shared/constants');
var events = require('../Events');
var settings = require('../utils/Settings');
var i18n = require('../translations/I18n');

var buildHTMLNode = require('../utils/BuildHTMLNode');
var html = require('../../../assets/html/Help.html');
var css = require('../../../assets/css/Help.css');
var htmlNode = buildHTMLNode(html, css);

var show = function() {
    htmlNode.style.display = 'block';
};

var hide = function() {
    htmlNode.style.display = 'none';
};

var configShowAtStartup = function() {
    var displayAtStartup = settings.get(consts.settings.DISPLAY_HELP_AT_STARTUP);

    var showAtStartupCheckbox = htmlNode.getElementsByClassName(consts.ui.help.SHOW_AT_STARTUP_CHECKBOX)[0];
    showAtStartupCheckbox.checked = displayAtStartup;
    showAtStartupCheckbox.onchange = function(event) {
        settings.set(consts.settings.DISPLAY_HELP_AT_STARTUP, showAtStartupCheckbox.checked);
    };

    if (!displayAtStartup) {
        hide();
    }
};

var init = function() {
    var container = document.getElementById(consts.ui.UI_CONTAINER);
    container.appendChild(htmlNode);

    var lockCursorHelp = htmlNode.getElementsByClassName(consts.ui.help.LOCK_CURSOR)[0];
    lockCursorHelp.innerHTML = i18n.t('help.lockCursor');

    var keysHelp = htmlNode.getElementsByClassName(consts.ui.help.KEYS)[0];
    keysHelp.innerHTML = i18n.t('help.keys');

    var closeButton = htmlNode.getElementsByClassName(consts.ui.CLOSE_BUTTON)[0];
    closeButton.onclick = hide;

    var showAtStartupCheckboxLabel = htmlNode.getElementsByClassName(consts.ui.help.SHOW_AT_STARTUP_CHECKBOX_LABEL)[0];
    showAtStartupCheckboxLabel.innerHTML = i18n.t('help.showAtStartup');

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
