'use strict';

var constants = require('./shared/constants');

require('./server/certificate-extension')();

var env = process.env.NODE_ENV || constants.environments.DEV;
console.log('Loading in ' + env + ' environment');
require('dotenv').load();

var port = process.env.PORT;
var express = require('express');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);
require('./server/socket/player-sync').init(io);
require('./server/socket/keyvr').init(io);
require('./server/rtc/signaling-server').init(io);

var db = require('./server/db/db');
db.init(process.env.COUCHBASE_HOST, process.env.BUCKET_NAME, process.env.BUCKET_PASSWORD);

var apiRouter = require('./server/api/router');
app.use(constants.routes.api.BASE, apiRouter);

require('./static-routes')(app);

app.get(constants.routes.LOGIN_SCREEN, function(req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.get(constants.routes.WORLD, function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(port, function() {
    console.log('Listening at port ' + port + '!');
});
