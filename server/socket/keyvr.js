'use strict';

var auth = require('./auth');
var constants = require('../../shared/constants');

var init = function(io) {
    io.of(constants.socket.keyvr.NAMESPACE).use(auth);

    io.of(constants.socket.keyvr.NAMESPACE).on('connection', function(socket) {
        socket.on(constants.socket.keyvr.QR_CODE_SCANNED, function(data) {
            socket.broadcast.to(data.keyboardId).emit(constants.socket.keyvr.DEVICE_CONNECTED, {deviceId: socket.id});
        });

        var forward = function(eventName) {
            socket.on(eventName, function(data) {
                socket.broadcast.to(data.deviceId).emit(eventName, data);
            });
        };

        forward(constants.browserEvents.KEY_DOWN);
        forward(constants.browserEvents.KEY_UP);
        forward(constants.browserEvents.MOUSE_MOVE);
        forward(constants.browserEvents.MOUSE_DOWN);
        forward(constants.browserEvents.MOUSE_UP);
    });
};

module.exports = {
    init: init
};
