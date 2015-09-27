'use strict';

define(['SocketIO', 'RTCMultiConnection', 'World', '2DUI', 'Constants'], function(io, RTCMultiConnection, world, ui, constants) {

    var init = function() {
        var connection = new RTCMultiConnection(constants.rtc.channel);
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

        connection.join(constants.rtc.DEFAULT_ROOM);
    };

    world.onInit(init);

    return {};
});
