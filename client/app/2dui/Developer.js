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

    var roundCoord = function(coord) {
        return parseFloat(Math.round(coord * 100) / 100).toFixed(3);
    };

    var updateCoords = function(position) {
        coords.innerHTML = 'X: ' +  roundCoord(position.x) + '<br/> Y: ' + roundCoord(position.y) + '<br/> Z: ' + roundCoord(position.z);
    };

    return {
        init: init
    };
});
