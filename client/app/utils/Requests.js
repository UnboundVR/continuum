var auth = require('../auth/Token');
var consts = require('../../../shared/constants');

var toJSON = function(res) {
    if (!res.ok) {
        throw res.statusText;
    }

    return res.json();
};

var get = function(url, useAuth) {
    if(useAuth === undefined) {
        useAuth = true;
    }

    var headers = {};
    if(useAuth) {
        headers.authorization = consts.auth.BEARER + ' ' + auth.getToken()
    }
    return fetch(url, {
        headers: headers,
        method: 'GET'
    }).then(toJSON);
};

var patch = function(url, payload) {
    return fetch(url, {
        headers: {
            authorization: consts.auth.BEARER + ' ' + auth.getToken(),
            'content-type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify(payload)
    }).then(toJSON);
};

module.exports = {
    get: get,
    patch: patch
};
