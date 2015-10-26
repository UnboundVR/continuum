var consts = require('../../../shared/constants');
var profileUtils = require('../../../shared/profileUtils');

var players = {};

var noPresenters = function() {
    for(var id in players) {
        var player = players[id];
        if(player.presenter) {
            return false;
        }
    }

    return true;
};

var register = function(playerId, profile, data, broadcast) {
    data.name = profile.name;
    data.id = playerId;
    data.email = profile.email;

    if (profileUtils.isAdmin(profile) && profileUtils.getSetting(profile, consts.settings.PRESENTER_MODE) && noPresenters()) {
        data.presenter = true;
    }

    players[playerId] = data;

    broadcast(data);
};

var update = function(playerId, data, broadcast) {
    if (players[playerId]) {
        var player = players[playerId];
        player.transform = data.transform;

        broadcast({
            id: playerId,
            transform: player.transform,
        });
    }
};

var disconnect = function(playerId, broadcast) {
    if (players[playerId]) {
        delete players[playerId];

        broadcast(playerId);
    }
};

module.exports = {
    register: register,
    update: update,
    disconnect: disconnect,
    players: players
};
