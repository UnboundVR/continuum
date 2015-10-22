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

    // console.log(playerId + ' registered (service)');
};

var update = function(playerId, data, broadcast) {
    if (players[playerId]) {
        var player = players[playerId];
        player.position = data.position;
        broadcast({
            id: playerId,
            position: player.position
        });
    } else {
        // console.log('trying to update position of ' + playerId + ' but it is not registered yet');
    }
};

var disconnect = function(playerId, broadcast) {
    if (players[playerId]) {
        delete players[playerId];
        broadcast(playerId);

        // console.log(playerId + ' disconnected (service)');
    } else {
        // console.log('trying to disconnect ' + playerId + ' before registering');
    }
};

module.exports = {
    register: register,
    update: update,
    disconnect: disconnect,
    players: players
};
