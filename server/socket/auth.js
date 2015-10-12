var jwt = require('socketio-jwt');
var certificate = require('../metavrse.cer');
var consts = require('../../shared/constants');

var authorize = jwt.authorize({
    secret: certificate,
    audience: consts.auth.AUTH0_AUDIENCE,
    handshake: true
});

module.exports = authorize;
