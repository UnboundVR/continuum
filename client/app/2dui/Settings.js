'use strict';

define(['html!Settings', 'Events', 'utils/Settings', 'Constants'], function(html, events, settings, constants) {
    var container;

    var show = function() {
        html.style.display = 'block';
    };

    var hide = function() {
        html.style.display = 'none';
    };

    var configSettings = function() {
        var isDeveloper = settings.get(constants.settings.IS_DEVELOPER);

        var isDeveloperCheckbox = container.getElementsByClassName(constants.ui.settings.IS_DEVELOPER_CHECKBOX)[0];
        isDeveloperCheckbox.checked = isDeveloper;
        isDeveloperCheckbox.onchange = function(event) {
            settings.set(constants.settings.IS_DEVELOPER, isDeveloperCheckbox.checked);
        };
    };

    var init = function() {
        container = document.getElementById(constants.ui.UI_CONTAINER);
        container.appendChild(html);

        events.subscribe(events.list.showsettings, function(display) {
            (display ? show : hide)();
        });

        var closeButton = html.getElementsByClassName(constants.ui.CLOSE_BUTTON)[0];
        closeButton.onclick = hide;

        hide();
        configSettings();
    };

    return {
        init: init,
        show: show,
        hide: hide
    };
});
