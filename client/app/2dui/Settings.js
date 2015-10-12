var consts = require('../../../shared/constants');
var events = require('../Events');
var settings = require('../utils/Settings');

// TODO migrate html

var container;

var show = function() {
    html.style.display = 'block';
};

var hide = function() {
    html.style.display = 'none';
};

var configSettings = function() {
    var isDeveloper = settings.get(consts.settings.IS_DEVELOPER);

    var isDeveloperCheckbox = container.getElementsByClassName(consts.ui.settings.IS_DEVELOPER_CHECKBOX)[0];
    isDeveloperCheckbox.checked = isDeveloper;
    isDeveloperCheckbox.onchange = function(event) {
        settings.set(consts.settings.IS_DEVELOPER, isDeveloperCheckbox.checked);
    };
};

var init = function() {
    container = document.getElementById(consts.ui.UI_CONTAINER);
    container.appendChild(html);

    events.subscribe(consts.events.SHOW_SETTINGS, function(display) {
        (display ? show : hide)();
    });

    var closeButton = html.getElementsByClassName(consts.ui.CLOSE_BUTTON)[0];
    closeButton.onclick = hide;

    hide();
    configSettings();
};

module.exports = {
    init: init,
    show: show,
    hide: hide
};
