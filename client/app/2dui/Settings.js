'use strict';

define(['html!Settings', 'Events'], function(html, events) {
    var container;

    var show = function() {
        html.style.display = 'block';
    };

    var hide = function() {
        html.style.display = 'none';
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
    };

    return {
        init: init,
        show: show,
        hide: hide
    };
});
