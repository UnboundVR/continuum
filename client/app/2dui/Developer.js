'use strict';

define(['html!Developer', 'Events', 'utils/Settings', 'Constants', 'World'], function(html, events, settings, constants, world) {
    var container;
    var coords;
    var position;

    var show = function() {
        html.style.display = 'block';
    };

    var hide = function() {
        html.style.display = 'none';
    };

    var init = function() {
        container = document.getElementById(constants.ui.UI_CONTAINER);
        container.appendChild(html);
        coords = container.getElementsByClassName(constants.ui.coords.COORDS_TEXT)[0];

        events.subscribe(events.list.playermoved, updateCoords);
        world.onLoop(displayUpdatedCoords, 1000);

        if(!settings.get(constants.settings.IS_DEVELOPER)) {
            hide();
        }
        settings.onChange(constants.settings.IS_DEVELOPER, function(display) {
            (display ? show : hide)();
        });
    };

    var roundCoord = function(coord) {
        return parseFloat(Math.round(coord * 100) / 100).toFixed(3);
    };

    var updateCoords = function(val) {
        position = val;
    };

    var displayUpdatedCoords = function() {
        if(position) {
            coords.innerHTML = 'X: ' +  roundCoord(position.x) + '<br/> Y: ' + roundCoord(position.y) + '<br/> Z: ' + roundCoord(position.z);
        }
    };

    return {
        init: init
    };
});
