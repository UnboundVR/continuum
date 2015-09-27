'use strict';

var jwt = require('socketio-jwt');
var certificate = require('../metavrse.cer');
var constants = require('../../shared/constants');

var authorize = jwt.authorize({
    secret: certificate,
    audience: constants.auth.AUTH0_AUDIENCE,
    handshake: true
});

module.exports = authorize;
