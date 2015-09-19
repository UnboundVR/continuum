// Based on https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html and http://www.html5rocks.com/en/tutorials/pointerlock/intro/
'use strict';

define(['FirstPersonControls', 'ScriptsManager'], function(controls, scripts) {
    var controlsEnabled = false;

    var init = function() {
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

        if (havePointerLock) {
            var element = document.body;

            var pointerLockChange = function(event) {
                if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                    controlsEnabled = true;
                    controls.controls.enabled = true;
                    scripts.dispatchEvent(scripts.events.pointerlock, null);
                } else {
                    controlsEnabled = false;
                    controls.controls.enabled = false;
                    scripts.dispatchEvent(scripts.events.pointerunlock, null);
                }
            };

            var pointerLockError = function(event) {
                // TODO do something meaningful, like allow the user to use the app without locking cursor (i.e. enable controls anyway)
                console.log('pointer lock error');
            };

            document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            var requestPointerLock = function() {
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
                if (controlsEnabled) {
                    document.exitPointerLock();
                } else {
                    requestPointerLock();
                }
            };
            
            // FIXME for some reason, using mouse events to toggle pointer lock causes the tab to flash when alt-tabbing if you leave pointer lock by pressing <esc>.
            var onMouseDown = function(event) {
                if (event.button === 1) {
                    togglePointerLock();
                }
            };
            
            var onKeyDown = function(event) {
                if(event.keyCode == '115') {
                    togglePointerLock();
                }  
            };

            window.addEventListener('mousedown', onMouseDown, false);
            window.addEventListener('keydown', onKeyDown, false);
        } else {
            // TODO do something meaningful, like allow the user to use the app without locking cursor (i.e. enable controls anyway)
            console.warn('Your browser doesn\'t seem to support Pointer Lock API');
        }
    };

    var enabled = function() {
        return controlsEnabled;
    };

    return {
        init: init,
        enabled: enabled
    };
});
