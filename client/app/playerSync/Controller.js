// Communicates with the player sync socket.io server.

var consts = require('../../../shared/constants');
var events = require('../Events');
var auth = require('../auth/Token');
var world = require('../World');
var io = require('socket.io-client');
var service = require('./Service');
var avatars = require('./Avatars');

var socket;

var init = function() {
    socket = io.connect(window.location.origin + consts.socket.playerSync.NAMESPACE, {
        query: consts.auth.TOKEN_PARAM + '=' + auth.getToken()
    });
    socket.on('connect', function() {
        service.me.id = this.id;

        socket.emit(consts.socket.playerSync.REGISTER, service.getPlayerInfo(), function(players, isPresenter) {
            service.me.isPresenter = isPresenter;

            for (var id in players) {
                var player = players[id];
                service.otherConnect(player);
            }

            events.subscribe(consts.events.PLAYER_TALKING, function(userId) {
                var player = service.players[userId];
                if(!player.presenter) {
                    avatars.toggleSpeakingFeedback(player, true);
                }
            });

            events.subscribe(consts.events.PLAYER_STOPPED_TALKING, function(userId) {
                var player = service.players[userId];
                if(!player.presenter) {
                    avatars.toggleSpeakingFeedback(player, false);
                }
            });

            events.subscribe(consts.events.PLAYER_MOVED, function(position) {
                socket.emit(consts.socket.playerSync.CHANGE, {position: position});
            });

            socket.on(consts.socket.playerSync.OTHER_CONNECT, service.otherConnect);
            socket.on(consts.socket.playerSync.OTHER_DISCONNECT, service.otherDisconnect);
            socket.on(consts.socket.playerSync.OTHER_CHANGE, service.otherChange);

            events.dispatch(consts.events.PLAYER_SYNC_READY);
        });
    });
};

world.onInit(init);
