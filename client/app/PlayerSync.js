var consts = require('../../shared/constants');
var events = require('./Events');
var scenes = require('./Scenes');
var auth = require('./auth/Token');
var world = require('./World');
var io = require('socket.io-client');
var three = require('three.js');

require('../../assets/fonts/Lato_Regular.js');

var socket;
var players;

var init = function() {
    socket = io.connect(window.location.origin + consts.socket.playerSync.NAMESPACE, {
        query: consts.auth.TOKEN_PARAM + '=' + auth.getToken()
    });

    players = {
        me: {
            position: new three.Vector3(0, consts.firstPerson.INITIAL_Y, 0)
        },
        others: {}
    };

    socket.on('connect', function() {
        socket.emit(consts.socket.playerSync.REGISTER, players.me);
    });

    socket.on(consts.socket.playerSync.OTHER_CONNECT, function(other) {
        players.others[other.id] = other;
        addPlayerAvatar(other);
    });

    socket.on(consts.socket.playerSync.OTHER_DISCONNECT, function(id) {
        var player = players.others[id];
        delete players.others[id];
        removePlayerAvatar(player);
    });

    socket.on(consts.socket.playerSync.OTHER_CHANGE, function(data) {
        var player = players.others[data.id];
        if (player) {
            player.position = data.position;
            player.mesh.position.copy(data.position);
        }
    });

    events.subscribe(consts.events.PLAYER_MOVED, playerMoved);
};

var removePlayerAvatar = function(player) {
    scenes.getScene().remove(player.mesh);
};

var addPlayerAvatar = function(player) {
    // TODO use decent player model
    /*var geometry = new three.BoxGeometry(40, 40, 40);
    var texture = three.ImageUtils.loadTexture('assets/img/grass.jpg');
    var material = new three.MeshBasicMaterial({map: texture});
    var playerMesh = new three.Mesh(geometry, material);*/

    var textGeometry = new THREE.TextGeometry(player.name, {
        size: 24,
        height: 5,
        curveSegments: 2,
        font: 'lato'
    });
    var textMaterial = new THREE.MeshFaceMaterial([
		new THREE.MeshBasicMaterial({ color: 0x00cc00}),
		new THREE.MeshBasicMaterial({ color: 0x000000})
	]);
    var textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.copy(player.position);
    player.mesh = textMesh;
    scenes.getScene().add(textMesh);
};

var playerMoved = function(position) {
    players.me.position = position;
    socket.emit(consts.socket.playerSync.CHANGE, players.me);
};

world.onInit(init);
