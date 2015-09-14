'use strict';

var players = {};

var init = function(io) {
	io.on('connection', function(socket) {
		socket.on('register', function(data) {
			console.log(socket.id)
			for (var id in players) {
				var player = players[id];
				io.to(socket.id).emit('other connect', player);
			}

			players[socket.id] = data;
			socket.broadcast.emit('other connect', data);
		});

		socket.on('change', function(data) {
			players[socket.id] = data;
			socket.broadcast.emit('other change', data);
		});

		socket.on('disconnect', function() {
			delete players[socket.id];
			socket.broadcast.emit('other disconnect', socket.id);
		});
	});
};

module.exports = {
	init: init,
	players: players
};