var players = [];

var register = function(controller, data) {
    for (var id in players) {
        controller.emitConnect(players[id])
    }

    data.name = controller.identity.name;
    players[controller.playerId] = data;
    controller.broadcastConnect(data);
};

var update = function(controller, data) {
    players[controller.playerId] = data;
    controller.broadcastChange(data);
};

var disconnect = function(controller) {
    delete players[controller.playerId];
    controller.broadcastDisconnect(controller.playerId);
};

module.exports = {
    register: register,
    update: update,
    disconnect: disconnect
};
