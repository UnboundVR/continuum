

define(['html!Help', 'i18n!nls/Help', 'utils/Settings', 'Events', 'Constants'], function(html, i18n, settings, events, constants) {
    var helpPanel;
    var container;

    var show = function() {
        html.style.display = 'block';
    };

    var hide = function() {
        html.style.display = 'none';
    };

    var configShowAtStartup = function() {
        var displayAtStartup = settings.get(constants.settings.DISPLAY_HELP_AT_STARTUP);

        var showAtStartupCheckbox = container.getElementsByClassName(constants.ui.help.SHOW_AT_STARTUP_CHECKBOX)[0];
        showAtStartupCheckbox.checked = displayAtStartup;
        showAtStartupCheckbox.onchange = function(event) {
            settings.set(constants.settings.DISPLAY_HELP_AT_STARTUP, showAtStartupCheckbox.checked);
        };

        if (!displayAtStartup) {
            hide();
        }
    };

    var init = function() {
        container = document.getElementById(constants.ui.UI_CONTAINER);
        container.appendChild(html);

        var lockCursorHelp = container.getElementsByClassName(constants.ui.help.LOCK_CURSOR)[0];
        lockCursorHelp.innerHTML = i18n.lockCursor;

        var keysHelp = container.getElementsByClassName(constants.ui.help.KEYS)[0];
        keysHelp.innerHTML = i18n.keys;

        var closeButton = html.getElementsByClassName(constants.ui.CLOSE_BUTTON)[0];
        closeButton.onclick = hide;

        configShowAtStartup();

        events.subscribe(constants.events.SHOW_HELP, function(display) {
            (display ? show : hide)();
        });
    };

    return {
        show: show,
        hide: hide,
        init: init
    };
});
