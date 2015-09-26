'use strict';

var DEV_ENVIRONMENT = 'dev';

require('./server/certificate-extension.js')();

var env = process.env.NODE_ENV || DEV_ENVIRONMENT;
console.log('Loading in ' + env + ' environment');
require('dotenv').load();

var port = process.env.PORT;
var express = require('express');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);
require('./server/socket/player-sync').init(io);
require('./server/socket/keyvr').init(io);

var db = require('./server/db/db');
db.init(process.env.COUCHBASE_HOST, process.env.BUCKET_NAME, process.env.BUCKET_PASSWORD);

var apiRouter = require('./server/api/router');
app.use('/api', apiRouter);

require('./static-routes')(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.get('/world', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(port, function() {
    console.log('Listening at port ' + port + '!');
});
