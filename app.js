'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Using body parser to parse JSON in for API calls
app.use('/api', bodyParser.json());

app.use('/client', express.static('client'));
app.use('/node_modules', express.static('node_modules'));

// Serve index file
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

var players = {};

// TODO move to other files
io.on('connection', function(socket) {
    console.log(socket.id + ' connected!');

	// Position sync
    socket.on('register', function(data) {
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
	
	// KeyVR
	socket.on('qrCodeScanned', function(data) {
		console.log(data.keyboardId + ' scanned!');
		socket.broadcast.to(data.keyboardId).emit('deviceConnected', {deviceId: socket.id});
	});
	
	socket.on('keypress', function(data) {
		socket.broadcast.to(data.deviceId).emit('keypress', {'key' : data.key, 'ts' : data.ts});
	});
});

var port = 1337;
http.listen(port, function() {
    console.log('Listeining at port ' + port + '!');
});
