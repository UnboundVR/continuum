var auth = require('./auth');
var consts = require('../../shared/constants');

var init = function(io) {
    io.of(consts.socket.keyvr.NAMESPACE).use(auth);

    io.of(consts.socket.keyvr.NAMESPACE).on('connection', function(socket) {
        socket.on(consts.socket.keyvr.QR_CODE_SCANNED, function(data) {
            socket.broadcast.to(data.keyboardId).emit(consts.socket.keyvr.DEVICE_CONNECTED, {deviceId: socket.id});
        });

        var forward = function(eventName) {
            socket.on(eventName, function(data) {
                socket.broadcast.to(data.deviceId).emit(eventName, data);
            });
        };

        forward(consts.browserEvents.KEY_DOWN);
        forward(consts.browserEvents.KEY_UP);
        forward(consts.browserEvents.MOUSE_MOVE);
        forward(consts.browserEvents.MOUSE_DOWN);
        forward(consts.browserEvents.MOUSE_UP);
    });
};

module.exports = {
    init: init
};
