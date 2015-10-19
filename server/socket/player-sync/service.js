var consts = require('../../../shared/Constants');
var profileUtils = require('../../../shared/profileUtils');

var players = {};

var register = function(playerId, profile, data, broadcast, emit) {
    for (var id in players) {
        emit(players[id]);
    }

    data.name = profile.name;
    data.id = playerId;

    if(profileUtils.isAdmin(profile) && profileUtils.getSetting(profile, consts.settings.GHOST_MODE)) {
        data.ghost = true;
    }

    players[playerId] = data;

    broadcast(data);

    console.log(playerId + ' registered (service)');
};

var update = function(playerId, data, broadcast) {
    if(players[playerId]) {
        var player = players[playerId];
        player.position = data.position;
        broadcast(player);
    } else {
        console.log('trying to update position of ' + playerId + ' but it is not registered yet');
    }
};

var disconnect = function(playerId, broadcast) {
    delete players[playerId];
    broadcast(playerId);

    console.log(playerId + ' disconnected (service)');
};

module.exports = {
    register: register,
    update: update,
    disconnect: disconnect,
    players: players
};
