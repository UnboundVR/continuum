'use strict';

define(['SocketIO', 'RTCMultiConnection', 'World'], function(io, rtc, world) {

    var init = function() {
        var port = '1338';
        var rtcMultiConnection = new rtc();
        var SIGNALING_SERVER = 'http://' + document.domain + ':' + port;
        var socket = io.connect(SIGNALING_SERVER);

        rtcMultiConnection.session = {
            audio: true,
            video: false,
            screen: false,
            data: false,
            oneway: false,
            broadcast: true
        };

        rtcMultiConnection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: false
        };

        rtcMultiConnection.openSignalingChannel = function(config) {
            var channel = 'continuum';
            var user = Math.round(Math.random() * 9999) + 9999;

            io.connect(SIGNALING_SERVER).emit('new-connection', {
                channel: channel,
                user: user
            });

            socket.send = function(message) {
                socket.emit('message', {
                    user: user,
                    data: message
                });
            };

            socket.on('message', config.onmessage);
        };

        rtcMultiConnection.open('continuum');
    };

    world.onInit(init);

    return {}
});
