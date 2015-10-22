// Logical component of player sync.

var avatars = require('./Avatars');
var controls = require('../FirstPersonControls');

var players = {};
var me = {};

var getPlayerInfo = function() {
    return {
        position: controls.getPosition()
    };
};

var otherConnect = function(other) {
    players[other.id] = other;
    if (!other.presenter) {
        avatars.add(other);
    }
};

var otherDisconnect = function(id) {
    var player = players[id];
    if(player) {
        delete players[id];
        if (!player.presenter) {
            avatars.remove(player);
        }
    }
};

var otherChange = function(other) {
    var player = players[other.id];
    if(player) {
        player.position = other.position;
        player.rotation = other.rotation;
        if (!player.presenter) {
            avatars.move(player);
        }
    }
};

module.exports = {
    getPlayerInfo: getPlayerInfo,
    otherConnect: otherConnect,
    otherDisconnect: otherDisconnect,
    otherChange: otherChange,
    players: players,
    me: me
};
