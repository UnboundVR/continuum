var io = require('socket.io-client');
var queryString = require('./utils/QueryString');
var world = require('./World');
var auth = require('./auth/Token');
var consts = require('../../shared/constants');
var CallbackList = require('./utils/CallbackList');

var socket;

var keyDownCallbacks = new CallbackList();
var keyUpCallbacks = new CallbackList();
var mouseMoveCallbacks = new CallbackList();
var mouseDownCallbacks = new CallbackList();
var mouseUpCallbacks = new CallbackList();
var enabled = false;

var init = function() {
    socket = io.connect(window.location.origin + consts.socket.keyvr.NAMESPACE, {
        query: consts.auth.TOKEN_PARAM + '=' + auth.getToken()
    });

    if (queryString.keyboardId) {
        syncWithKeyboard(queryString[consts.socket.keyvr.KEYBOARD_ID]);
        enabled = true;
    }
};

var syncWithKeyboard = function(keyboardId) {
    socket.on(consts.browserEvents.KEY_DOWN, function(data) {
        keyDownCallbacks.execute({
            keyCode: data.key,
            type: consts.browserEvents.KEY_DOWN
        });
    });

    socket.on(consts.browserEvents.KEY_UP, function(data) {
        keyUpCallbacks.execute({
            keyCode: data.key,
            type: consts.browserEvents.KEY_UP
        });
    });

    socket.on(consts.browserEvents.MOUSE_MOVE, function(data) {
        mouseMoveCallbacks.execute(data.movement);
    });

    socket.on(consts.browserEvents.MOUSE_DOWN, function(data) {
        mouseDownCallbacks.execute({button: data.button});
    });

    socket.on(consts.browserEvents.MOUSE_UP, function(data) {
        mouseUpCallbacks.execute({button: data.button});
    });

    socket.emit(consts.socket.keyvr.QR_CODE_SCANNED, {keyboardId: keyboardId});
};

world.onInit(init);

module.exports = {
    onKeyDown: keyDownCallbacks.push,
    onKeyUp: keyUpCallbacks.push,
    onMouseMove: mouseMoveCallbacks.push,
    onMouseDown: mouseDownCallbacks.push,
    onMouseUp: mouseUpCallbacks.push,
    enabled: function(argument) {
        return enabled;
    }
};
