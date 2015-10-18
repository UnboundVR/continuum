var consts = require('../../../shared/constants');
var Auth0 = require('auth0-js');

module.exports = new Auth0({
    domain: consts.auth.AUTH0_DOMAIN,
    clientID: consts.auth.AUTH0_AUDIENCE
});
