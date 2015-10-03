'use strict';

define(['Three', 'Constants', 'i18n!nls/Auth'], function(THREE, constants, i18n) {

    var idToken;
    var userProfile;

    var returnToLoginScreen = function() {
        window.location.href = constants.routes.LOGIN_SCREEN;
    };

    var processIdToken = function() {
        var auth0 = new Auth0({
            domain: constants.auth.AUTH0_DOMAIN,
            clientID: constants.auth.AUTH0_AUDIENCE,
            callbackURL: window.location.origin + constants.routes.WORLD
        });

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
                returnToLoginScreen();
            }

            auth0.getProfile(idToken, function(err, profile) {
                window.location.hash = '';

                if (err) {
                    reject('There was an error geting the profile: ' + err.message);
                    return;
                }

                userProfile = profile;
                resolve();
            });
        });
    };

    var getToken = function() {
        return idToken;
    };

    var getProfile = function() {
        return userProfile;
    };

    var logout = function() {
        localStorage.removeItem(constants.auth.ID_TOKEN);
        localStorage.removeItem(constants.auth.AUTH0_PROFILE);

        returnToLoginScreen();
    };

    var getVocative = function() {
        var profile = getProfile();

        var vocative = i18n.vocatives.human;
        if (profile.gender == constants.auth.GENDER_MALE) {
            vocative = i18n.vocatives.gentleman;
        } else if (profile.gender == constants.auth.GENDER_FEMALE) {
            vocative = i18n.vocatives.lady;
        }

        return vocative;
    };

    return {
        getToken: getToken,
        getProfile: getProfile,
        logout: logout,
        getVocative: getVocative,
        processIdToken: processIdToken
    };
});
