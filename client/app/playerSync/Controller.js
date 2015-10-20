// Communicates with the player sync socket.io server.

var consts = require('../../../shared/constants');
var events = require('../Events');
var auth = require('../auth/Token');
var world = require('../World');
var io = require('socket.io-client');
var service = require('./Service');

var socket;

var init = function() {
    socket = io.connect(window.location.origin + consts.socket.playerSync.NAMESPACE, {
        query: consts.auth.TOKEN_PARAM + '=' + auth.getToken()
    });

    socket.on('connect', function() {
        socket.emit(consts.socket.playerSync.REGISTER, service.getInitialPlayerInfo());
    });

    events.subscribe(consts.events.PLAYER_MOVED, function(position) {
        socket.emit(consts.socket.playerSync.CHANGE, {position: position});
    });

    socket.on(consts.socket.playerSync.OTHER_CONNECT, service.otherConnect);

    socket.on(consts.socket.playerSync.OTHER_DISCONNECT, service.otherDisconnect);

    socket.on(consts.socket.playerSync.OTHER_CHANGE, service.otherChange);
};

world.onInit(init);
