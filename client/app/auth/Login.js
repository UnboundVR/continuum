'use strict';

define(['Events', './Token', './Logout', './Profile', './Auth0'], function(events, token, logout, profile, auth0) {
    return function() {
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

        events.subscribe(events.list.logout, logout);

        return token.processIdToken().then(function(idToken) {
            return fetchProfile(idToken);
        });
    };
});
