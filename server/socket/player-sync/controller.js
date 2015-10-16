var auth = require('../auth');
var consts = require('../../../shared/constants');
var service = require('./service');

var init = function(io) {
    io.of(consts.socket.playerSync.NAMESPACE).use(auth);

    io.of(consts.socket.playerSync.NAMESPACE).on('connection', function(socket) {
        socket.on(consts.socket.playerSync.REGISTER, function(data) {
            var broadcast = function(player) {
                socket.broadcast.emit(consts.socket.playerSync.OTHER_CONNECT, player);
            };

            var emit = function(player) {
                socket.emit(consts.socket.playerSync.OTHER_CONNECT, player);
            };

            service.register(socket, data, broadcast, emit);
        });

        socket.on(consts.socket.playerSync.CHANGE, function(data) {
            var broadcast = function(player) {
                socket.broadcast.emit(consts.socket.playerSync.OTHER_CHANGE, player);
            };

            service.update(socket, data, broadcast);
        });

        socket.on('disconnect', function() {
            var broadcast = function(playerId) {
                socket.broadcast.emit(consts.socket.playerSync.OTHER_DISCONNECT, playerId);
            };

            service.disconnect(socket, broadcast);
        });
    });
};

module.exports = {
    init: init,
    players: players
};
