var world = require('./World');
var SimpleWebRTC = require('simplewebrtc');
var profile = require('./auth/Profile');
var playerSync = require('./playerSync/Service');
var THREE = require('three.js');

var webrtc;

var init = function() {
    var presenter = false; // TODO fetch from auth0 setting

    var media = {
        audio: true,
        video: false
    };

    if (presenter) {
        media.video = true;
    }

    webrtc = new SimpleWebRTC({
        localVideoEl: presenter ? 'localVideo' : '', // TODO add a div called localVideo to ui, and display that div ONLY if you're presenter
        remoteVideosEl: '',
        autoRequestMedia: true,
        media: media,
        nick: profile.getProfile().email
    });

    webrtc.on('readyToCall', function () {
        webrtc.joinRoom('continuum');
    });

    webrtc.on('videoAdded', function(video, peer) {
        console.log(peer.nick + ' joined');
        // TODO add video to dom element with id remoteVideo only if presenter left
    });

    webrtc.on('videoRemoved', function(video, peer) {
        console.log(peer.nick + ' left');
        // TODO remove video from dom element with id remoteVideo only if presenter left
    });
};

var updateVolumes = function() {
    webrtc.getPeers().forEach(function(peer) {
        if(peer.videoEl) {
            var player = playerSync.getByEmail(peer.nick);
            if(player) {
                var myPosition = playerSync.getPlayerInfo().position;
                var p = player.position;
                var otherPosition = new THREE.Vector3(p.x, p.y, p.z);
                var volume = 750 / myPosition.distanceTo(otherPosition);

                if(volume > 1) {
                    volume = 1;
                }
                
                peer.videoEl.volume = volume;
            }
        }
    });
};

world.onInit(init);
world.onLoop(updateVolumes);
