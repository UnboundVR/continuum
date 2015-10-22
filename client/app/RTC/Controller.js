var world = require('../World');
var SimpleWebRTC = require('simplewebrtc');
var profile = require('../auth/Profile');
var settings = require('../utils/Settings');
var consts = require('../../../shared/constants');
var playerSync = require('../playerSync/Service');
var gui = require('../gui/Manager');
var events = require('../Events');
var THREE = require('three.js');
var SIOConnection = require('./SocketIOConnection');

var webrtc;
var videoPanel = '22F7E49B-E4E0-43FF-BE28-B152AA33BED5'; // FIXME hardcoded
var presenter;

var init = function() {
    var userId = playerSync.me.id;
    var isPresenter = playerSync.me.isPresenter;

    var media = {
        audio: true,
        video: isPresenter
    };

    var sioConnection = new SIOConnection({
        url: 'http://unboundvr.com:8088',
        socketio: {}
    });

    webrtc = new SimpleWebRTC({
        localVideoEl: isPresenter ? 'localVideo' : '',
        remoteVideosEl: '',
        autoRequestMedia: true,
        media: media,
        nick: userId,
        connection: sioConnection
    });

    webrtc.on('readyToCall', function() {
        webrtc.joinRoom('continuum-' + location.host);
    });

    webrtc.on('videoAdded', function(video, peer) {
        console.log(peer.nick + ' logged in');
        peer.getDataChannel('hark').onmessage = function(message) {
            var harkEvent = JSON.parse(message.data);

            if (harkEvent.type == 'volume') {
                if (harkEvent.volume > (-85)) {
                    //Speakin'
                    events.dispatch(consts.events.PLAYER_TALKING, peer.nick);
                } else {
                    //Not speakin'
                    events.dispatch(consts.events.PLAYER_STOPPED_TALKING, peer.nick);
                }
            };
        };

        if (!presenter && playerSync.players[peer.nick] && playerSync.players[peer.nick].presenter) {
            presenter = peer.nick;
            gui.beam(video, videoPanel);
        };
    });

    webrtc.on('videoRemoved', function(video, peer) {
        console.log(peer.nick + ' logged out');
        if (peer.nick === presenter) {
            gui.cancel(videoPanel);
            presenter = undefined;
        };
    });

    world.onLoop(updateVolumes);
};

var updateVolumes = function() {
    webrtc.getPeers().forEach(function(peer) {
        if (peer.videoEl) {
            var player = playerSync.players[peer.nick];
            if (player) {
                var myPosition = playerSync.getPlayerInfo().position;
                var p = player.position;
                var otherPosition = new THREE.Vector3(p.x, p.y, p.z);
                var volume = 750 / myPosition.distanceTo(otherPosition);

                if (volume > 1) {
                    volume = 1;
                }

                peer.videoEl.volume = volume;
            }
        }
    });
};

events.subscribe(consts.events.PLAYER_SYNC_READY, init);
