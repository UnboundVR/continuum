// Logical component of player sync.

var avatars = require('./Avatars');
var controls = require('../FirstPersonControls');

var players = {};

var getInitialPlayerInfo = function() {
    return {
        position: controls.getPosition()
    };
};

var otherConnect = function(other) {
    players[other.id] = other;
    if (!other.ghost) {
        avatars.add(other);
    }
};

var otherDisconnect = function(id) {
    var player = players[id];
    delete players[id];
    if (!player.ghost) {
        avatars.remove(player);
    }
};

var otherChange = function(other) {
    var player = players[other.id];
    player.position = other.position;
    if (!player.ghost) {
        avatars.move(player);
    }
};

module.exports = {
    getInitialPlayerInfo: getInitialPlayerInfo,
    otherConnect: otherConnect,
    otherDisconnect: otherDisconnect,
    otherChange: otherChange,
    players: players
};
