var auth = require('../auth/Token');
var constants = require('../../../shared/constants');

var toJSON = function(res) {
    if (!res.ok) {
        throw res.statusText;
    }

    return res.json();
};

var get = function(url) {
    return fetch(url, {
        headers: {
            authorization: consts.auth.BEARER + ' ' + auth.getToken()
        },
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
