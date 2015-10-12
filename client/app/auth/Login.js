

define(['Events', 'Constants', './Token', './Logout', './Profile', './Auth0'], function(events, constants, token, logout, profile, auth0) {
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

        events.subscribe(constants.events.LOGOUT, logout);

        return token.processIdToken().then(function(idToken) {
            return fetchProfile(idToken);
        });
    };
});
