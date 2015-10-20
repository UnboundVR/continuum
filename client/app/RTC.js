var world = require('./World');
var SimpleWebRTC = require('simplewebrtc');

var init = function() {
    var webrtc = new SimpleWebRTC({
        localVideoEl: 'localVideo',
        remoteVideosEl: 'remoteVideo',
        autoRequestMedia: true
    });

    webrtc.on('readyToCall', function () {
      webrtc.joinRoom('continuum');
    });
};

world.onInit(init);
