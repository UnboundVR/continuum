'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use('/node_modules', express.static('node_modules'));
app.use('/voicetest', express.static('voicetest'));

require('./server/rtc/signaling-server').init(io);

var port = 1338;
server.listen(port, function() {
    console.log('Voice server listening at port ' + port + '!');
});
