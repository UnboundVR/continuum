'use strict';

define(['Constants', './Logout', './Auth0'], function(constants, logout, auth0) {

    var auth0;
    var idToken;

    var processIdToken = function() {
        return new Promise(function(resolve, reject) {
            idToken = localStorage.getItem(constants.auth.ID_TOKEN);
            var hash = auth0.parseHash(window.location.hash);

            if (!idToken && hash && hash[constants.auth.ID_TOKEN]) {
                idToken = hash[constants.auth.ID_TOKEN];
                localStorage.setItem(constants.auth.ID_TOKEN, idToken);
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

    return {
        getToken: getToken,
        processIdToken: processIdToken
    };
});
