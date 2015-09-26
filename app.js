'use strict';

// Allow requiring .cer files as text
var fs = require('fs');
require.extensions['.cer'] = function(module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

require('dotenv').load();

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

var env = process.env.NODE_ENV;
var port;

switch (env) {
    case 'production':
        port = 1337;
        break;
    case 'dev':
        port = 1338;
        break;
    case 'test':
        port = 1339;
        break;
    default:
        throw 'Environment not recognized.';
        break;
}

http.listen(port, function() {
    console.log('Listening at port ' + port + '!');
});
