'use strict';

define(['SocketIO', 'RTCMultiConnection', 'World'], function(io, rtc, world) {

    var init = function() {
        var port = '1338';
        var connection = new rtc('continuum');
        var SIGNALING_SERVER = 'http://localhost:1338';
        var socket = io.connect(SIGNALING_SERVER);

        /*rtcMultiConnection.session = {
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

        rtcMultiConnection.channel = 'continuum';
        rtcMultiConnection.open();

        rtcMultiConnection.openSignalingChannel = function(config) {
            console.log('bla');
            var channel = 'continuum';
            var user = Math.round(Math.random() * 9999) + 9999;

            socket.emit('new-connection', {
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
        };*/



    };

    world.onInit(init);

    return {}
});
