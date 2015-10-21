var world = require('./World');
var SimpleWebRTC = require('simplewebrtc');
var profile = require('./auth/Profile');
var settings = require('./utils/Settings');
var consts = require('../../shared/constants');
var playerSync = require('./playerSync/Service');
var gui = require('./gui/Manager');
var THREE = require('three.js');
var webrtc;
var videoPanel = 'F57146D0-9296-4408-B753-0532A3B8AC2F'; // FIXME hardcoded
var presenter;

var init = function() {
    var isPresenter = settings.get(consts.settings.PRESENTER_MODE);

    var media = {
        audio: true,
        video: isPresenter
    };

    getUserMedia(function(err, stream) {
        if (err) throw err;

        var options = {};
        var speechEvents = hark(stream, options);

        speechEvents.on('speaking', function() {

        });

        speechEvents.on('stopped_speaking', function() {

        });
    });

    webrtc = new SimpleWebRTC({
        localVideoEl: isPresenter ? 'localVideo' : '',
        remoteVideosEl: '',
        autoRequestMedia: true,
        media: media,
        nick: profile.getProfile().email,
        url: 'https://unboundvr.com:8088'
    });

    webrtc.on('readyToCall', function () {
        webrtc.joinRoom('continuum');
    });

    webrtc.on('videoAdded', function(video, peer) {
        console.log(peer.nick + ' joined');
        if(!presenter && !isPresenter && playerSync.getByEmail(peer.nick).presenter) {
            presenter = peer.nick;
            gui.beam(video, videoPanel);
        };
    });

    webrtc.on('videoRemoved', function(video, peer) {
        console.log(peer.nick + ' left');
        if(!isPresenter && peer.nick === presenter) {
            gui.cancel(videoPanel);
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
