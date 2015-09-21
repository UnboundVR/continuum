'use strict';

define(['SocketIO', 'RTCMultiConnection', 'World'], function(io, rtc, world) {

    var init = function() {
        var connection = new rtc('continuum');
        connection.socketURL = 'http://localhost:1337';
        
        connection.session = {
             audio:     true,
             video:     false, 
             screen:    false,
             
             data:      false,
             
             oneway:    false,
             broadcast: false
        };    
        
/*
        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: false
        };
*/    
        connection.join('hola');
    };

    world.onInit(init);

    return {}
});
