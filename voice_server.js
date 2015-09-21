'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use('/node_modules', express.static('node_modules'));
app.use('/voicetest', express.static('voicetest'));

require('rtcmulticonnection-v3/Signaling-Server')(server);

var port = 1338;
server.listen(port, function() {
    console.log('Voice server listening at port ' + port + '!');
});
