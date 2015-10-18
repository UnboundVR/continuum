var players = [];

var register = function(socket, data, broadcast, emit) {
    for (var id in players) {
        emit(players[id]);
    }

    data.name = socket.profile.name;

    players[socket.id] = data;

    broadcast(data);

};

var update = function(socket, data, broadcast) {
    players[socket.id] = data;
    broadcast(data);
};

var disconnect = function(socket, broadcast) {
    delete players[socket.id];
    broadcast(socket.id);
};

module.exports = {
    register: register,
    update: update,
    disconnect: disconnect
};
