var jwt = require('express-jwt');
var certificate = require('../metavrse.cer');
var constants = require('../../shared/constants');

var jwtCheck = jwt({
    secret: certificate,
    audience: constants.auth.AUTH0_AUDIENCE
});

module.exports = jwtCheck;
