var jwt = require('express-jwt');
var certificate = require('../metavrse.cer');
var consts = require('../../shared/constants');

var jwtCheck = jwt({
    secret: certificate,
    audience: consts.auth.AUTH0_AUDIENCE
});

module.exports = jwtCheck;
