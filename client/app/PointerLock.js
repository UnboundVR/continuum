// Based on https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html and http://www.html5rocks.com/en/tutorials/pointerlock/intro/
'use strict';

// TODO separate toggle logic from pointer lock, put pointer lock in utils and use constants
define(['World', 'Constants', 'Events'], function(world, constants, events) {
    var enabled = false;
    var requestPointerLock;

    var init = function() {
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

        if (havePointerLock) {
            var element = document.body;

            var pointerLockChange = function(event) {
                if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                    enabled = true;
                    events.dispatch(constants.events.POINTER_LOCK_CHANGE, true);
                } else {
                    enabled = false;
                    events.dispatch(constants.events.POINTER_LOCK_CHANGE, false);
                }
            };

            var pointerLockError = function(event) {
                // TODO do something meaningful, like allow the user to use the app without locking cursor (i.e. enable controls anyway)
                console.warn('pointer lock error');
            };

            document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            requestPointerLock = function() {
                if (/Firefox/i.test(navigator.userAgent)) {
                    var fullscreenchange = function(event) {
                        if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                            document.removeEventListener('fullscreenchange', fullscreenchange);
                            document.removeEventListener('mozfullscreenchange', fullscreenchange);
                            element.requestPointerLock();
                        }
                    };

                    document.addEventListener('fullscreenchange', fullscreenchange, false);
                    document.addEventListener('mozfullscreenchange', fullscreenchange, false);
                    element.requestFullscreen();
                } else {
                    element.requestPointerLock();
                }
            };

            document.addEventListener('pointerlockchange', pointerLockChange, false);
            document.addEventListener('mozpointerlockchange', pointerLockChange, false);
            document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
            document.addEventListener('pointerlockerror', pointerLockError, false);
            document.addEventListener('mozpointerlockerror', pointerLockError, false);
            document.addEventListener('webkitpointerlockerror', pointerLockError, false);

            var togglePointerLock = function() {
                if (enabled) {
                    document.exitPointerLock();
                } else {
                    requestPointerLock();
                }
            };

            // FIXME for some reason, using mouse events to toggle pointer lock causes the tab to flash when alt-tabbing if you leave pointer lock by pressing <esc>.
            var onMouseDown = function(event) {
                if (event.button === constants.mouse.MID_BUTTON) {
                    togglePointerLock();
                }
            };

            window.addEventListener(constants.browserEvents.MOUSE_DOWN, onMouseDown, false);
        } else {
            // TODO do something meaningful, like allow the user to use the app without locking cursor (i.e. enable controls anyway)
            console.warn('Your browser doesn\'t seem to support Pointer Lock API');
        }
    };

    var isEnabled = function() {
        return enabled;
    };

    world.onInit(init);

    return {
        enabled: isEnabled,
        lockCursor: function() {
            requestPointerLock();
        }
    };
});
