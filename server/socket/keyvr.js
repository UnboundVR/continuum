'use strict';

var init = function(io) {
	io.of('/keyvr').on('connection', function(socket) {
		socket.on('qrCodeScanned', function(data) {
			socket.broadcast.to(data.keyboardId).emit('deviceConnected', {deviceId: socket.id});
		});
		
		socket.on('keydown', function(data) {
			socket.broadcast.to(data.deviceId).emit('keydown', {'key' : data.key, 'ts' : data.ts});
		});

		socket.on('keyup', function(data) {
			socket.broadcast.to(data.deviceId).emit('keyup', {'key' : data.key, 'ts' : data.ts});
		});
	});
};

module.exports = {
	init: init
};