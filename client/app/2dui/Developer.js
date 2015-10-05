'use strict';

define(['html!Developer', 'Events'], function(html, events) {
    var container;
    var coords;

    var init = function() {
        container = document.getElementById(constants.ui.UI_CONTAINER);
        container.appendChild(html);
        coords = container.getElementsByClassName(constants.ui.coords.COORDS_TEXT)[0];

        events.subscribe(events.list.playermoved, updateCoords);
    };

    var updateCoords = function(position) {
        coords.innerHTML = 'X: ' + position.x;
    };

    return {
        init: init
    };
});
