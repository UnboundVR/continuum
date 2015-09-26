'use strict';

define(['SocketIO', 'RTCMultiConnection', 'World'], function(io, RTCMultiConnection, world) {

    var init = function() {
        var connection = new RTCMultiConnection('continuum');
        connection.socketURL = window.location.origin;

        connection.session = {
            audio:     true,
            video:     false,
            screen:    false,

            data:      false,

            oneway:    false,
            broadcast: false
        };

        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: false
        };

        connection.join('hola');
    };

    world.onInit(init);

    return {};
});
