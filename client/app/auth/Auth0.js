'use strict';

define(['Constants'], function(constants) {
    return new Auth0({
        domain: constants.auth.AUTH0_DOMAIN,
        clientID: constants.auth.AUTH0_AUDIENCE
    });
});
