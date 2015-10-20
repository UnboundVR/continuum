var consts = require('../../shared/constants');
var events = require('./Events');
var scenes = require('./Scenes');
var auth = require('./auth/Token');
var world = require('./World');
var io = require('socket.io-client');
var THREE = require('three.js');

var socket;
var players;

var init = function() {
    socket = io.connect(window.location.origin + consts.socket.playerSync.NAMESPACE, {
        query: consts.auth.TOKEN_PARAM + '=' + auth.getToken()
    });

    players = {
        me: {
            position: new THREE.Vector3(0, consts.firstPerson.INITIAL_Y, 0)
        },
        others: {}
    };

    socket.on('connect', function() {
        //console.log('registering me (' + this.id + ')');

        socket.emit(consts.socket.playerSync.REGISTER, players.me);
        players.me.id = this.id;
    });

    socket.on(consts.socket.playerSync.OTHER_CONNECT, function(other) {
        //console.log(other.id + ' connected');

        players.others[other.id] = other;
        if(!other.ghost) {
            addPlayerAvatar(other);
        }
    });

    socket.on(consts.socket.playerSync.OTHER_DISCONNECT, function(id) {
        //console.log(id + ' disconnected');

        var player = players.others[id];
        delete players.others[id];
        if(!player.ghost) {
            removePlayerAvatar(player);
        }
    });

    socket.on(consts.socket.playerSync.OTHER_CHANGE, function(other) {
        //console.log(other.id + ' changed');

        var player = players.others[other.id];
        if (player) {
            player.position = other.position;
            if(!player.ghost) {
                movePlayerAvatar(player);
            }
        }
    });

    events.subscribe(consts.events.PLAYER_MOVED, playerMoved);
};

var movePlayerAvatar = function(player) {
    player.mesh.position.copy(player.position);
};

var removePlayerAvatar = function(player) {
    scenes.getScene().remove(player.mesh);
};

var addPlayerAvatar = function(player) {
    // TODO use player model

    var canvas = document.createElement('canvas');
    var size = 512;
    canvas.width = size;
    canvas.height = size;
    var context = canvas.getContext('2d');
    context.fillStyle = '#00ff00';
    context.textAlign = 'center';
    context.font = '48px Arial';
    context.fillText(player.name, size / 2, size / 2);

    var map = new THREE.Texture(canvas);
    map.needsUpdate = true;

    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
    var text = new THREE.Sprite( material );
    text.scale.set(50,50,1);

    text.position.copy(player.position);
    player.mesh = text;
    scenes.getScene().add(player.mesh);
    console.log(player.mesh)
};

var playerMoved = function(position) {
    players.me.position = position;
    socket.emit(consts.socket.playerSync.CHANGE, players.me);
};

world.onInit(init);
