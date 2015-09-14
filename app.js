'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var playerSync = require('./server/socket/player-sync');
playerSync.init(io);

var keyVR = require('./server/socket/keyvr');
keyVR.init(io);

// Using body parser to parse JSON in for API calls
app.use('/server/api', bodyParser.json());

app.use('/client', express.static('client'));
app.use('/node_modules', express.static('node_modules'));
app.use('/keyvr', express.static('keyvr'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var port = 1337;
http.listen(port, function() {
    console.log('Listeining at port ' + port + '!');
});
