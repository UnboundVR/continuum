'use strict';

// TODO refactor using react

// Init Node.JS and listen to mobile device connection
var socket = io.connect(window.location.origin + constants.socket.keyvr.NAMESPACE, {
    query: constants.auth.TOKEN_PARAM + '=' + localStorage.getItem(constants.auth.ID_TOKEN)
});

// As soon as we connect to node, we get assigned an ID
socket.on('connect', function() {
    hookQRButton(this.id);
});

// After we have an ID, we can enable the "Generate QR" button, since the QR is generated based on this ID
function hookQRButton(keyboardId) {
    $(function() {
        $('#dasButton').attr('disabled', null);

        $('#dasForm').submit(function(e) {
            e.preventDefault();

            var customAddress = $('#customAddress').val();
            var payload = (customAddress || window.location.origin)
                + constants.routes.WORLD
                + '?' + constants.socket.keyvr.KEYBOARD_ID
                + '=' + keyboardId;

            $('#qrCode').qrcode(payload);
            $('#localLink').attr('href', payload);

            showScreen('linkDevice');
        });
    });
}

// When a device scans the QR code, we hook the keypress events so we start sending socket.io messages whenever a key is pressed
socket.on(constants.socket.keyvr.DEVICE_CONNECTED, function(data) {
    var hookEvent = function(eventName, dataCallback) {
        $(document)[eventName](function(e) {
            var defaultObj = {
                ts: new Date(),
                deviceId: data.deviceId
            };

            var payload = $.extend(defaultObj, dataCallback(e));
            socket.emit(eventName, payload);
        });
    };

    var keyboardDataCallback = function(e) {
        return {
            key: e.which
        };
    };

    var mouseButtonDataCallback = function(e) {
        return {
            button: e.button
        };
    };

    var mouseMoveDataCallback = function(e) {
        return {
            movement: {
                x: event.movementX || event.mozMovementX || event.webkitMovementX || 0,
                y: event.movementY || event.mozMovementY || event.webkitMovementY || 0
            }
        };
    };

    hookEvent(constants.browserEvents.KEY_DOWN, keyboardDataCallback);
    hookEvent(constants.browserEvents.KEY_UP, keyboardDataCallback);
    hookEvent(constants.browserEvents.MOUSE_MOVE, mouseMoveDataCallback);
    hookEvent(constants.browserEvents.MOUSE_DOWN, mouseButtonDataCallback);
    hookEvent(constants.browserEvents.MOUSE_UP, mouseButtonDataCallback);

    showScreen('deviceLinked');
});

// FIXME pointer lock stuff, which is repeated in PointerLock.js inside metavrse... should be abstracted somehow
// Also, we're not handling the case where there is no pointer lock - I think it'll simply crash
function requestPointerLock() {
    var element = document.body;

    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

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
}

// Simple function to display a div and hide others
function showScreen(screen) {
    $('.displaying').addClass('notDisplaying').removeClass('displaying');
    $('#' + screen).removeClass('notDisplaying').addClass('displaying');
}
