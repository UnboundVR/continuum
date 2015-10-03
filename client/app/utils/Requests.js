'use strict';

define(['Auth', 'Constants'], function(auth, constants) {
    var toJSON = function(res) {
        return res.json();
    };

    var get = function(url) {
        return fetch(url, {
            headers: {
                authorization: constants.auth.BEARER + ' ' + auth.getToken()
            },
            method: 'GET'
        }).then(toJSON);
    };

    var patch = function(url, payload) {
        return fetch(url, {
            headers: {
                authorization: constants.auth.BEARER + ' ' + auth.getToken()
            },
            method: 'PATCH',
            body: new Blob([JSON.stringify(payload)], {type: 'application/json'})
        }).then(toJSON);
    };

    return {
        get: get,
        patch: patch
    };
});
