var consts = require('../../../shared/Constants');
var logout = require('./Logout');
var auth0 = require('./Auth0');

var auth0;
var idToken;

var processIdToken = function() {
    return new Promise(function(resolve, reject) {
        idToken = localStorage.getItem(consts.auth.ID_TOKEN);
        var hash = auth0.parseHash(window.location.hash);

        if (!idToken && hash && hash[consts.auth.ID_TOKEN]) {
            idToken = hash[consts.auth.ID_TOKEN];
            localStorage.setItem(consts.auth.ID_TOKEN, idToken);
        }

        if (hash && hash.error) {
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

            reject('There was an error: ' + hash.error + '\n' + hash.error_description);

            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

            return;
        }

        if (!idToken) {
            logout();
        }

        resolve(idToken);
    });
};

var getToken = function() {
    return idToken;
};

module.exports = {
    getToken: getToken,
    processIdToken: processIdToken
};
