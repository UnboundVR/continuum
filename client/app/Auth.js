'use strict';

define(['Three', 'Constants'], function(THREE, constants) {

    var returnToLoginScreen = function() {
        window.location.href = constants.routes.LOGIN_SCREEN;
    };

    var getToken = function() {
        var idToken = localStorage.getItem(constants.auth.ID_TOKEN);

        if (idToken) {
            return idToken;
        } else {
            returnToLoginScreen();
        }
    };

    var getProfile = function() {
        var profile = localStorage.getItem(constants.auth.AUTH0_PROFILE);

        if (profile) {
            return JSON.parse(profile);
        } else {
            returnToLoginScreen();
        }
    };

    var logout = function() {
        localStorage.removeItem(constants.auth.ID_TOKEN);
        localStorage.removeItem(constants.auth.AUTH0_PROFILE);

        returnToLoginScreen();
    };

    var getVocative = function() {
        var profile = getProfile();

        var vocative = 'human';
        if (profile.gender == constants.auth.GENDER_MALE) {
            vocative = 'gentleman';
        } else if (profile.gender == constants.auth.GENDER_FEMALE) {
            vocative = 'lady';
        }

        return vocative;
    };

    return {
        getToken: getToken,
        getProfile: getProfile,
        logout: logout,
        getVocative: getVocative
    };
});
