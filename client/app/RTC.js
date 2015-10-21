var world = require('./World');
var SimpleWebRTC = require('simplewebrtc');
var profile = require('./auth/Profile');
var playerSync = require('./playerSync/Service');

var webrtc;

var init = function() {
    var presenter = false;

    var media = {
        audio: true,
        video: false
    };

    if (presenter) {
        media.video = true;
    }

    webrtc = new SimpleWebRTC({
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

var updateVolumes = function() {
    webrtc.getPeers().forEach(function(peer) {
        if(peer.videoEl) {
            console.log('peer ' + peer.nick + ' has video', peer);
            var distance = 2;
            peer.videoEl.volume = 1 / distance;
        }
    });
};

world.onInit(init);
world.onLoop(updateVolumes);
