'use strict';

var app = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('new-connection', function(socket) {
    console.log('New connection from ' + socket.user);
});

var port = 1338;
server.listen(port, function() {
    console.log('Voice server listeining at port ' + port + '!');
});
