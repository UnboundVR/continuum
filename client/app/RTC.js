var io = require('socket.io-client');
var world = require('./World');
var ui = require('./2dui/Container');
var consts = require('../../shared/Constants');

window.io = io;
require('rtcmulticonnection-v3/RTCMultiConnection.js'); // TODO use browserify-shim

var init = function() {
    var connection = new RTCMultiConnection(consts.rtc.channel);
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

    connection.join(consts.rtc.DEFAULT_ROOM);
};

world.onInit(init);
