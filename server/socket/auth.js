var jwt = require('socketio-jwt');
var certificate = require('../metavrse.cer');
var consts = require('../../shared/constants');
var Promise = require('promise');
var request = require('request');

var authorize = jwt.authorize({
    secret: certificate,
    audience: consts.auth.AUTH0_AUDIENCE,
    handshake: true
});

var getProfile = function(socket) {
    return new Promise(function(resolve, reject) {
        var params = {
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

            id_token: socket.handshake.query.token

            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        };

        request.post('https://' + consts.auth.AUTH0_DOMAIN + '/tokeninfo', {form: params}, function(err, res, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
};

module.exports = {
    authorize: authorize,
    getProfile: getProfile
};
