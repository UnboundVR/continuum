var auth = require('../auth');
var consts = require('../../../shared/constants');
var service = require('./service');
var extend = require('util')._extend;

var init = function(io) {
    io.of(consts.socket.playerSync.NAMESPACE).use(auth.authorize);

    io.of(consts.socket.playerSync.NAMESPACE).on('connection', function(socket) {
        // console.log(socket.id + ' connected (controller)');
        socket.on(consts.socket.playerSync.REGISTER, function(data, callback) {
            auth.getProfile(socket).then(function(profile) {
                if (!socket.connected) {
                    // console.log(socket.id + ' got disconnected before completing registration');
                    return;
                }

                var broadcastConnect = function(player) {
                    socket.broadcast.emit(consts.socket.playerSync.OTHER_CONNECT, player);
                };

                var players = extend({}, service.players);
                service.register(socket.id, profile, data, broadcastConnect);
                callback(players, service.players[socket.id].presenter);
            });
        });

        socket.on(consts.socket.playerSync.CHANGE, function(data) {
            var broadcastChange = function(player) {
                socket.broadcast.volatile.emit(consts.socket.playerSync.OTHER_CHANGE, player);
            };

            service.update(socket.id, data, broadcastChange);
        });

        socket.on('disconnect', function() {
            // console.log(socket.id + ' disconnected (controller)');
            var broadcastDisconnect = function(playerId) {
                socket.broadcast.emit(consts.socket.playerSync.OTHER_DISCONNECT, playerId);
            };

            service.disconnect(socket.id, broadcastDisconnect);
        });
    });
};

module.exports = {
    init: init
};
