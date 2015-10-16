var auth = require('../auth');
var consts = require('../../../shared/constants');
var service = require('./service');

var init = function(io) {
    io.of(consts.socket.playerSync.NAMESPACE).use(auth);

    io.of(consts.socket.playerSync.NAMESPACE).on('connection', function(socket) {
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

        var identity = socket.decoded_token;

        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        socket.on(consts.socket.playerSync.REGISTER, function(data) {
            var broadcastConnect = function(player) {
                socket.broadcast.emit(consts.socket.playerSync.OTHER_CONNECT, player);
            };

            var emitConnect = function(player) {
                socket.emit(consts.socket.playerSync.OTHER_CONNECT, player);
            };

            var controllerInterface = {
                broadcastConnect: broadcastConnect,
                emitConnect: emitConnect,
                identity: identity,
                playerId: socket.id
            };

            service.register(controllerInterface, data);
        });

        socket.on(consts.socket.playerSync.CHANGE, function(data) {
            var broadcastChange = function(player) {
                socket.broadcast.emit(consts.socket.playerSync.OTHER_CHANGE, player);
            };

            var controllerInterface = {
                broadcastChange: broadcastChange,
                playerId: socket.id
            };

            service.update(controllerInterface, data);
        });

        socket.on('disconnect', function() {
            var broadcastDisconnect = function(playerId) {
                socket.broadcast.emit(consts.socket.playerSync.OTHER_DISCONNECT, playerId);
            };

            var controllerInterface = {
                broadcastDisconnect: broadcastDisconnect,
                playerId: socket.id
            };

            service.disconnect(controllerInterface);
        });
    });
};

module.exports = {
    init: init
};
