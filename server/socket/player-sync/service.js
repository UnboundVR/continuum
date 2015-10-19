var players = [];

var register = function(socket, data, broadcast, emit) {
    for (var id in players) {
        emit(players[id]);
    }

    data.name = socket.profile.name;
    data.id = socket.id

    players[socket.id] = data;

    broadcast(data);

    console.log(socket.id + ' registered (service)');
};

var update = function(socket, data, broadcast) {
    if(players[socket.id]) {
        var player = players[socket.id];
        player.position = data.position;
        broadcast(player);
    } else {
        console.log('trying to update position of ' + socket.id + ' but it is not registered yet');
    }
};

var disconnect = function(socket, broadcast) {
    delete players[socket.id];
    broadcast(socket.id);

    console.log(socket.id + ' disconnected (service)');
};

module.exports = {
    register: register,
    update: update,
    disconnect: disconnect
};
