var world = require('./World');
var SimpleWebRTC = require('simplewebrtc');

var init = function() {
    var presenter = false;

    var media = {
        audio: true,
        video: false
    };

    if (presenter) {
        media.video = true;
    }

    var webrtc = new SimpleWebRTC({
        localVideoEl: '', // change depending on stuff
        remoteVideosEl: '', // change depending on stuff
        autoRequestMedia: true,
        media: media
    });

    webrtc.on('readyToCall', function () {
      webrtc.joinRoom('continuum');
    });

    webrtc.on('videoAdded', function(video, peer) {
        peer.videoEl.volume = 0.5;
        console.log(peer.videoEl.volume)
    });
};

world.onInit(init);
