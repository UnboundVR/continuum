'use strict';

var players = {};

var init = function(io) {
    io.of('/sync').on('connection', function(socket) {
        var identity = socket.request.decoded_token;

        socket.on('register', function(data) {
            for (var id in players) {
                var player = players[id];
                player.name = identity.name;
                socket.emit('other connect', player);
            }

            players[socket.id] = data;
            socket.broadcast.emit('other connect', data);
        });

        socket.on('change', function(data) {
            players[socket.id] = data;
            socket.broadcast.emit('other change', data);
        });

        socket.on('disconnect', function() {
            delete players[socket.id];
            socket.broadcast.emit('other disconnect', socket.id);
        });
    });
};

module.exports = {
    init: init,
    players: players
};
