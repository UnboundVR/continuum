var world = require('./World');
var SimpleWebRTC = require('simplewebrtc');
var profile = require('./auth/Profile');
var settings = require('./utils/Settings');
var consts = require('../../shared/constants');
var playerSync = require('./playerSync/Service');
var gui = require('./gui/Manager');
var events = require('./Events');
var THREE = require('three.js');

var webrtc;
var videoPanel = 'F57146D0-9296-4408-B753-0532A3B8AC2F'; // FIXME hardcoded
var presenter;

var init = function() {
    var userId = playerSync.me.id;
    var isPresenter = playerSync.me.isPresenter;

    var media = {
        audio: true,
        video: isPresenter
    };

    webrtc = new SimpleWebRTC({
        localVideoEl: isPresenter ? 'localVideo' : '',
        remoteVideosEl: '',
        autoRequestMedia: true,
        media: media,
        nick: userId,
        url: 'http://unboundvr.com:8088'
    });

    webrtc.on('readyToCall', function () {
        webrtc.joinRoom('continuum');
    });

    webrtc.on('videoAdded', function(video, peer) {
        peer.getDataChannel('hark').onmessage = function(message) {
            var harkEvent = JSON.parse(message.data);
            console.log(harkEvent);
        }
        if(!presenter && playerSync.players[peer.nick] && playerSync.players[peer.nick].presenter) {
            presenter = peer.nick;
            gui.beam(video, videoPanel);
        };
    });

    webrtc.on('videoRemoved', function(video, peer) {
        if(peer.nick === presenter) {
            gui.cancel(videoPanel);
            presenter = undefined;
        };
    });

    world.onLoop(updateVolumes);
};

var updateVolumes = function() {
    webrtc.getPeers().forEach(function(peer) {
        if(peer.videoEl) {
            var player = playerSync.players[peer.nick];
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

events.subscribe(consts.events.PLAYER_SYNC_READY, init);
