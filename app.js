'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var playerSync = require('./server/socket/player-sync');
playerSync.init(io);

var apiRouter = require('./server/api/router');
app.use('/api', apiRouter);

app.use('/client', express.static('client'));
app.use('/node_modules', express.static('node_modules'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var port = 1337;
http.listen(port, function() {
    console.log('Listeining at port ' + port + '!');
});
