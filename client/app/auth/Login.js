var consts = require('../../../shared/constants');
var events = require('../Events');
var token = require('./Token');
var logout = require('./Logout');
var profile = require('./Profile');
var auth0 = require('./Auth0');

module.exports = function() {
    var fetchProfile = function() {
        return new Promise(function(resolve, reject) {
            token.processIdToken();
            auth0.getProfile(token.getToken(), function(err, userProfile) {
                token.clearHash();

                if (err) {
                    logout();
                }

                profile.setProfile(userProfile);
                resolve();
            });
        });
    };

    events.subscribe(consts.events.LOGOUT, logout);

    return fetchProfile();
};
