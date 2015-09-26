'use strict';

define(['Three'], function(THREE) {

    var getToken = function() {
        return localStorage.getItem('id_token');
    };

    var getProfile = function() {
        return JSON.parse(localStorage.getItem('auth0_profile'));
    };

    var logout = function() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('auth0_profile');
        window.location.href = '/';
    };

    return {
        getToken: getToken,
        getProfile: getProfile,
        logout: logout
    };
});
