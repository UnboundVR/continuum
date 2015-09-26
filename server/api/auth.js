var jwt = require('express-jwt');
var certificate = require('../metavrse.cer');

var jwtCheck = jwt({
    secret: certificate,
    audience: process.env.AUTH0_AUDIENCE
});

module.exports = jwtCheck;
