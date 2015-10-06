'use strict';

define(['SocketIO', 'utils/QueryString', 'World', 'auth/Token', 'utils/CallbackList', 'Constants'], function(io, queryString, world, auth, CallbackList, constants) {
    var socket;

    var keyDownCallbacks = new CallbackList();
    var keyUpCallbacks = new CallbackList();
    var mouseMoveCallbacks = new CallbackList();
    var mouseDownCallbacks = new CallbackList();
    var mouseUpCallbacks = new CallbackList();
    var enabled = false;

    var init = function() {
        socket = io.connect(window.location.origin + constants.socket.keyvr.NAMESPACE, {
            query: constants.auth.TOKEN_PARAM + '=' + auth.getToken()
        });

        if (queryString.keyboardId) {
            syncWithKeyboard(queryString[constants.socket.keyvr.KEYBOARD_ID]);
            enabled = true;
        }
    };

    var syncWithKeyboard = function(keyboardId) {
        socket.on(constants.events.KEY_DOWN, function(data) {
            keyDownCallbacks.execute({
                keyCode: data.key,
                type: constants.events.KEY_DOWN
            });
        });

        socket.on(constants.events.KEY_UP, function(data) {
            keyUpCallbacks.execute({
                keyCode: data.key,
                type: constants.events.KEY_UP
            });
        });

        socket.on(constants.events.MOUSE_MOVE, function(data) {
            mouseMoveCallbacks.execute(data.movement);
        });

        socket.on(constants.events.MOUSE_DOWN, function(data) {
            mouseDownCallbacks.execute({button: data.button});
        });

        socket.on(constants.events.MOUSE_UP, function(data) {
            mouseUpCallbacks.execute({button: data.button});
        });

        socket.emit(constants.socket.keyvr.QR_CODE_SCANNED, {keyboardId: keyboardId});
    };

    world.onInit(init);

    return {
        onKeyDown: keyDownCallbacks.push,
        onKeyUp: keyUpCallbacks.push,
        onMouseMove: mouseMoveCallbacks.push,
        onMouseDown: mouseDownCallbacks.push,
        onMouseUp: mouseUpCallbacks.push,
        enabled: function(argument) {
            return enabled;
        }
    };
});
