var sioJwt = require('socketio-jwt');
var certificate = require('../metavrse.cer');

var authorize = sioJwt.authorize({
    secret: certificate,
    handshake: true
});

module.exports = authorize;
