'use strict';

var app = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connect', function(socket) {
    console.log('New connection');
});

var port = 1338;
server.listen(port, function() {
    console.log('Voice server listening at port ' + port + '!');
});
