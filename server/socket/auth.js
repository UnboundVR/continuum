var jwt = require('socketio-jwt');
var certificate = require('../metavrse.cer');

var authorize = jwt.authorize({
    secret: certificate,
    audience: process.env.AUTH0_AUDIENCE,
    handshake: true
});

module.exports = authorize;
