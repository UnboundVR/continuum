var sioJwt = require('socketio-jwt');
var certificate = require('../metavrse.cer');

var init = function(io) {
    io.set('authorization', sioJwt.authorize({
        secret: certificate,
        handshake: true
    }));
};

module.exports = {
    init: init
};
