'use strict';

define(['World', 'Events', 'PointerLock', 'Constants', './Help', './Developer', './Profile', './Actions', './Settings'], function(world, events, pointerLock, constants, help, developer, profile, actions, settings) {

    var container;

    var init = function() {
        container = document.getElementById(constants.ui.UI_CONTAINER);
        initChildren(profile, help, developer, actions, settings);

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
        events.dispatch(events.list.showhelp, false);
        events.dispatch(events.list.showsettings, false);
    };

    var addElement = function(element) {
        container.appendChild(element);
    };

    world.onInit(init);

    return {
        addElement: addElement
    };
});
