'use strict';

define(['Three'], function(THREE) {

    var returnToLoginScreen = function() {
        window.location.href = '/';
    };

    var getToken = function() {
        var idToken = localStorage.getItem('id_token');

        if (idToken) {
            return idToken;
        } else {
            returnToLoginScreen();
        }
    };

    var getProfile = function() {
        var profile = localStorage.getItem('auth0_profile');

        if (profile) {
            return JSON.parse(profile);
        } else {
            returnToLoginScreen();
        }
    };

    var logout = function() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('auth0_profile');

        returnToLoginScreen();
    };

    var getVocative = function() {
        var profile = getProfile();

        var vocative = 'human';
        if (profile.gender == 'male') {
            vocative = 'gentleman';
        } else if (profile.gender == 'female') {
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
