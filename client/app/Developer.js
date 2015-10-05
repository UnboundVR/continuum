'use strict';

define(['text!assets/html/Developer.html', 'text!assets/css/Developer.css', 'utils/BuildHTMLNode', 'Events'], function(html, css, buildHTMLNode, events) {
    var container;
    var coords;

    var init = function() {
        container = document.getElementById(constants.ui.UI_CONTAINER);
        var element = buildHTMLNode(html, css);
        container.appendChild(element);
        coords = container.getElementsByClassName(constants.coords.COORDS_TEXT)[0];

        events.subscribe(events.list.playermoved, updateCoords);
    };

    var updateCoords = function(position) {
        coords.innerHTML = 'X: ' + position.x;
    };

    return {
        init: init
    };
});
