var world = require('./World');
var SimpleWebRTC = require('simplewebrtc');
var profile = require('./auth/Profile');
var settings = require('./utils/Settings');
var consts = require('../../shared/constants');
var playerSync = require('./playerSync/Service');
var THREE = require('three.js');

var webrtc;

var init = function() {
    var presenter = settings.get(consts.settings.PRESENTER_MODE);

    var media = {
        audio: true,
        video: false
    };

    if (presenter) {
        media.video = true;
    }

    webrtc = new SimpleWebRTC({
        localVideoEl: presenter ? 'localVideo' : '',
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
        if(playerSync.getByEmail(peer.nick).presenter) {
            document.getElementById('remoteVideo').appendChild(video);
        };
    });

    webrtc.on('videoRemoved', function(video, peer) {
        console.log(peer.nick + ' left');
        if(playerSync.getByEmail(peer.nick).presenter) {
            document.getElementById('remoteVideo').removeChild(video);
        };
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
