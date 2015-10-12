var auth = require('./auth');
var constants = require('../../shared/constants');

var players = {};

var init = function(io) {
    io.of(constants.socket.playerSync.NAMESPACE).use(auth);

    io.of(constants.socket.playerSync.NAMESPACE).on('connection', function(socket) {
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

        var identity = socket.decoded_token;

        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        socket.on(constants.socket.playerSync.REGISTER, function(data) {
            for (var id in players) {
                var player = players[id];
                player.name = identity.name;
                socket.emit(constants.socket.playerSync.OTHER_CONNECT, player);
            }

            players[socket.id] = data;
            socket.broadcast.emit(constants.socket.playerSync.OTHER_CONNECT, data);
        });

        socket.on(constants.socket.playerSync.CHANGE, function(data) {
            players[socket.id] = data;
            socket.broadcast.emit(constants.socket.playerSync.OTHER_CHANGE, data);
        });

        socket.on('disconnect', function() {
            delete players[socket.id];
            socket.broadcast.emit(constants.socket.playerSync.OTHER_DISCONNECT, socket.id);
        });
    });
};

module.exports = {
    init: init,
    players: players
};
