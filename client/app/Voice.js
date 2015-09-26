'use strict';

define(['SocketIO', 'RTCMultiConnection', 'World', '2DUI'], function(io, RTCMultiConnection, world, ui) {

    var init = function() {
        var connection = new RTCMultiConnection('continuum');
        connection.socketURL = window.location.origin;

        connection.session = {
            audio:     true,
            video:     false,
            screen:    false,

            data:      false,

            oneway:    false,
            broadcast: true
        };

        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: false
        };

        connection.onstream = function(e) {
            ui.addElement(e.mediaElement);
        };

        connection.join('hola');
    };

    world.onInit(init);

    return {};
});
