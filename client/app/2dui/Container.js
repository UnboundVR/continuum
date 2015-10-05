'use strict';

define(['World', 'Events', 'PointerLock', 'Constants', './Help', './Developer', './Profile', './Actions'], function(world, events, pointerLock, constants, help, developer, profile, actions) {

    var container;

    var init = function() {
        container = document.getElementById(constants.ui.UI_CONTAINER);
        initChildren(profile, help, developer, actions);

        events.subscribe(events.list.pointerlockchange, function(locked) {
            if (!locked) {
                enableUI();
            } else {
                disableUI();
            }
        });
    };

    var initChildren = function() {
        [].slice.call(arguments).forEach(function(child) {
            child.init();
        });
    };

    var enableUI = function() {
        container.style.display = '';
    };

    var disableUI = function() {
        container.style.display = constants.html.DISPLAY_NONE;
        help.hide();
    };

    var addElement = function(element) {
        container.appendChild(element);
    };

    world.onInit(init);

    return {
        addElement: addElement
    };
});
