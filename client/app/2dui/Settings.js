var consts = require('../../../shared/constants');
var events = require('../Events');
var settings = require('../utils/Settings');
var i18n = require('../translations/I18n');
var profile = require('../auth/Profile');
var languages = require('../translations/Languages');

var buildHTMLNode = require('../utils/BuildHTMLNode');
var html = require('../../../assets/html/Settings.html');
var css = require('../../../assets/css/Settings.css');
var htmlNode = buildHTMLNode(html, css);

var show = function() {
    htmlNode.style.display = 'block';
};

var hide = function() {
    htmlNode.style.display = 'none';
};

var languageSelect;

var configSettings = function() {
    var isDeveloper = settings.get(consts.settings.IS_DEVELOPER);
    var isDeveloperCheckbox = htmlNode.getElementsByClassName(consts.ui.settings.IS_DEVELOPER_CHECKBOX)[0];
    isDeveloperCheckbox.checked = isDeveloper;
    isDeveloperCheckbox.onchange = function(event) {
        settings.set(consts.settings.IS_DEVELOPER, isDeveloperCheckbox.checked);
    };

    var ghostMode = settings.get(consts.settings.GHOST_MODE);
    var ghostModeCheckbox = htmlNode.getElementsByClassName(consts.ui.settings.GHOST_MODE_CHECKBOX)[0];
    ghostModeCheckbox.checked = ghostMode;
    ghostModeCheckbox.onchange = function(event) {
        settings.set(consts.settings.GHOST_MODE, ghostModeCheckbox.checked).then(function() {
            window.location.reload();
        });
    };

    var language = settings.get(consts.settings.LANGUAGE);
    languageSelect.value = language;
    languageSelect.onchange = function(event) {
        settings.set(consts.settings.LANGUAGE, languageSelect.value).then(function() {
            window.location.reload();
        });
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

    var languageLabel = htmlNode.getElementsByClassName(consts.ui.settings.LANGUAGE_LABEL)[0];
    languageLabel.innerHTML = i18n.t('settings.language');
    languageSelect = htmlNode.getElementsByClassName(consts.ui.settings.LANGUAGE_SELECT)[0];
    var langs = Object.keys(languages);
    langs.push(consts.settings.LANGUAGE.defaultValue);
    langs.forEach(function(lang) {
        var option = document.createElement('option');
        option.value = lang;
        option.innerHTML = i18n.t('languages.' + lang);
        languageSelect.appendChild(option);
    });

    if(!profile.isAdmin()) {
        var div = htmlNode.getElementsByClassName(consts.ui.settings.GHOST_MODE_DIV)[0];
        div.style.display = 'none';
    }

    var ghostModeCheckboxLabel = htmlNode.getElementsByClassName(consts.ui.settings.GHOST_MODE_CHECKBOX_LABEL)[0];
    ghostModeCheckboxLabel.innerHTML = i18n.t('settings.ghostMode');

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
