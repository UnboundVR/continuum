var consts = require('../../../shared/constants');
var events = require('../Events');
var settings = require('../utils/Settings');
var i18n = require('../translations/Polyglot');

var buildHTMLNode = require('../utils/BuildHTMLNode');
var html = require('../../../assets/html/Settings.html')
var css = require('../../../assets/css/Settings.css');
var htmlNode = buildHTMLNode(html, css);

var show = function() {
    htmlNode.style.display = 'block';
};

var hide = function() {
    htmlNode.style.display = 'none';
};

var configSettings = function() {
    var isDeveloper = settings.get(consts.settings.IS_DEVELOPER);

    var isDeveloperCheckbox = htmlNode.getElementsByClassName(consts.ui.settings.IS_DEVELOPER_CHECKBOX)[0];
    isDeveloperCheckbox.checked = isDeveloper;
    isDeveloperCheckbox.onchange = function(event) {
        settings.set(consts.settings.IS_DEVELOPER, isDeveloperCheckbox.checked);
    };
};

var init = function() {
    var container = document.getElementById(consts.ui.UI_CONTAINER);
    container.appendChild(htmlNode);

    events.subscribe(consts.events.SHOW_SETTINGS, function(display) {
        (display ? show : hide)();
    });

    var isDeveloperCheckboxLabel = htmlNode.getElementsByClassName(consts.ui.settings.IS_DEVELOPER_CHECKBOX_LABEL)[0];
    isDeveloperCheckboxLabel.innerHTML = i18n.t('settings.dev');

    var closeButton = htmlNode.getElementsByClassName(consts.ui.CLOSE_BUTTON)[0];
    closeButton.onclick = hide;

    hide();
    configSettings();
};

module.exports = {
    init: init,
    show: show,
    hide: hide
};
