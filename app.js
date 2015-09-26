'use strict';

var DEV_ENVIRONMENT = 'dev';

// Allow requiring .cer files as text
var fs = require('fs');
require.extensions['.cer'] = function(module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var env = process.env.NODE_ENV || DEV_ENVIRONMENT;
console.log('Loading in ' + env + ' environment');
require('dotenv').load();

var port = process.env.PORT;
var express = require('express');
var app = express();
var http = require('http').Server(app);

var jwt = require('express-jwt');
var jwtCheck = jwt({
    secret: require('./server/metavrse.cer'),
    audience: process.env.AUTH0_AUDIENCE
});

var io = require('socket.io')(http);

var playerSync = require('./server/socket/player-sync');
playerSync.init(io);

var keyVR = require('./server/socket/keyvr');
keyVR.init(io);

var db = require('./server/db/db');

db.init(process.env.COUCHBASE_HOST, process.env.BUCKET_NAME, process.env.BUCKET_PASSWORD);

var apiRouter = require('./server/api/router');
app.use('/api', jwtCheck);
app.use('/api', apiRouter);

var signalingServer = require('./server/rtc/signaling-server');
signalingServer.init(io);

app.use('/client', express.static('client'));
app.use('/shared', express.static('shared'));
app.use('/node_modules', express.static('node_modules'));
app.use('/voicetest', express.static('voicetest'));
app.use('/keyvr', express.static('keyvr'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.get('/world', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(port, function() {
    console.log('Listening at port ' + port + '!');
});
