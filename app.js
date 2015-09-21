'use strict';

// Allow requiring .cer files as text
var fs = require('fs');
require.extensions['.cer'] = function(module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var express = require('express');
var app = express();
var http = require('http').Server(app);

var jwt = require('express-jwt');
var jwtCheck = jwt({
    secret: require('./server/metavrse.cer'),
    audience: 'XjqQOct27l6s9mJmkikqC9OPaCOkmM0S' // TODO take from .env file
});

var io = require('socket.io')(http);
var authIO = require('./server/socket/auth');
authIO.init(io);

var playerSync = require('./server/socket/player-sync');
playerSync.init(io);

var keyVR = require('./server/socket/keyvr');
keyVR.init(io);

var db = require('./server/db/db');

// TODO take from .env file
db.init('couchbase://127.0.0.1', 'metavrse', '111111');

var apiRouter = require('./server/api/router');
app.use('/api', jwtCheck);
app.use('/api', apiRouter);

app.use('/client', express.static('client'));
app.use('/shared', express.static('shared'));
app.use('/node_modules', express.static('node_modules'));
app.use('/keyvr', express.static('keyvr'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.get('/world', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var port = 1337;
http.listen(port, function() {
    console.log('Listeining at port ' + port + '!');
});
