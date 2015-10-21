// Logical component of player sync.

var avatars = require('./Avatars');
var controls = require('../FirstPersonControls');

var players = {};

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
        if (!player.presenter) {
            avatars.move(player);
        }
    }
};

var getByEmail = function(email) {
    for(var id in players) {
        var player = players[id];
        if(player.email === email) {
            return player;
        }
    }
};

module.exports = {
    getPlayerInfo: getPlayerInfo,
    otherConnect: otherConnect,
    otherDisconnect: otherDisconnect,
    otherChange: otherChange,
    players: players,
    getByEmail: getByEmail
};
