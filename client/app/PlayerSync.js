'use strict';

define(['SocketIO', 'Scene', 'World', 'Auth', 'Constants'], function(io, scene, world, auth, constants) {
    var socket;
    var players;

    var init = function() {
        socket = io.connect(window.location.origin + constants.socket.playerSync.NAMESPACE, {
            query: constants.auth.TOKEN_PARAM + '=' + auth.getToken()
        });

        players = {
            me: {
                // FIXME un-hardcode, use real name...
                name: 'YO',
                position: new THREE.Vector3(0, constants.firstPerson.INITIAL_Y, 0)
            },
            others: {}
        };

        socket.on('connect', function() {
            players.me.id = this.id;
            socket.emit(constants.socket.playerSync.REGISTER, players.me);
        });

        socket.on(constants.socket.playerSync.OTHER_CONNECT, function(other) {
            players.others[other.id] = other;
            addPlayerAvatar(other);
        });

        socket.on(constants.socket.playerSync.OTHER_DISCONNECT, function(id) {
            var player = players.others[id];
            delete players.others[id];
            removePlayerAvatar(player);
        });

        socket.on(constants.socket.playerSync.OTHER_CHANGE, function(data) {
            var player = players.others[data.id];
            if (player) {
                player.position = data.position;
                player.mesh.position.copy(data.position);
            }
        });
    };

    var removePlayerAvatar = function(player) {
        scene.getScene().remove(player.mesh);
    };

    var addPlayerAvatar = function(player) {
        // TODO use decent player model
        var geometry = new THREE.BoxGeometry(40, 40, 40);
        var texture = THREE.ImageUtils.loadTexture('client/assets/img/grass.jpg');
        var material = new THREE.MeshBasicMaterial({map: texture});

        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(player.position);

        player.mesh = mesh;

        scene.getScene().add(mesh);
    };

    var playerMoved = function(position) {
        players.me.position = position;
        socket.emit(constants.socket.playerSync.change, players.me);
    };

    world.onInit(init);

    return {
        playerMoved: playerMoved
    };
});
