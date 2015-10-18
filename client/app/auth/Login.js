var consts = require('../../../shared/constants');
var events = require('../Events');
var token = require('./Token');
var logout = require('./Logout');
var profile = require('./Profile');
var auth0 = require('./Auth0');

module.exports = function() {
    var fetchProfile = function(idToken) {
        return new Promise(function(resolve, reject) {
            auth0.getProfile(idToken, function(err, userProfile) {
                window.location.hash = '';

                if (err) {
                    logout();
                }

                profile.setProfile(userProfile);
                resolve();
            });
        });
    };

    events.subscribe(consts.events.LOGOUT, logout);

    return token.processIdToken().then(function(idToken) {
        return fetchProfile(idToken);
    });
};
