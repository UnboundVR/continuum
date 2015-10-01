'use strict';

define(['Auth', 'Three', 'Constants'], function(auth, THREE, constants) {
    var remoteLoader = new THREE.XHRLoader();

    var refreshToken = function() {
        var token = auth.getToken();
        if (token) {
            remoteLoader.authorizationHeader = constants.auth.BEARER + ' ' + token;
        }
    }

    var getJSON = function(url) {
        refreshToken();
        var promise = new Promise(function(resolve, reject) {
            remoteLoader.load(url, function(text) {
                try {
                    resolve(JSON.parse(text));
                } catch (err) {
                    reject(err);
                }
            }, undefined, function(err) {

                reject(err);
            });
        });

        return promise;
    };

    return {
        getJSON: getJSON
    };
});
