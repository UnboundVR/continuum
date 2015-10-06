'use strict';

define(['auth/Token', 'Constants'], function(auth, constants) {
    var toJSON = function(res) {
        if(!res.ok) {
            throw res.statusText;
        }
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
                authorization: constants.auth.BEARER + ' ' + auth.getToken(),
                'content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(payload)
        }).then(toJSON);
    };

    return {
        get: get,
        patch: patch
    };
});
