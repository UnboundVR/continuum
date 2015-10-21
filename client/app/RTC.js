var world = require('./World');
var SimpleWebRTC = require('simplewebrtc');
var profile = require('./auth/Profile');

var init = function() {
    var presenter = true;

    var media = {
        audio: true,
        video: false
    };

    if (presenter) {
        media.video = true;
    }

    var webrtc = new SimpleWebRTC({
        localVideoEl: 'localVideo', // change depending on stuff
        remoteVideosEl: 'remoteVideo', // change depending on stuff
        autoRequestMedia: true,
        media: media,
        nick: profile.getProfile().email
    });

    webrtc.on('readyToCall', function () {
        webrtc.joinRoom('continuum');
    });

    webrtc.on('videoAdded', function(video, peer) {
        peer.videoEl.volume = 0.5;
        console.log(peer.nick + ' joined');
    });
};

world.onInit(init);
