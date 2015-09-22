'use strict';

var init = function(io) {
    io.of('/keyvr').on('connection', function(socket) {
        socket.on('qrCodeScanned', function(data) {
            socket.broadcast.to(data.keyboardId).emit('deviceConnected', {deviceId: socket.id});
        });

        var forward = function(eventName) {
            socket.on(eventName, function(data) {
                socket.broadcast.to(data.deviceId).emit(eventName, data);
            });
        };

        forward('keydown');
        forward('keyup');
        forward('mousemove');
        forward('mousedown');
        forward('mouseup');
    });
};

module.exports = {
    init: init
};
