'use strict';

define(['SocketIO', 'Scene', 'World', 'Auth'], function(io, scene, world, auth) {
    var socket;
    var players;
    
    var init = function() {
        socket = io.connect(window.location.origin + '/sync', {
            query: 'token=' + auth.getToken()
        });
        
        players = {
            me: {
                name: 'YO',
                position: new THREE.Vector3(0, 15, 0)
            },
            others: {}
        };
        
        socket.on('connect', function() {
            players.me.id = this.id;
            socket.emit('register', players.me);
        });

        socket.on('other connect', function(other) {
            players.others[other.id] = other;
            addPlayerAvatar(other);
        });

        socket.on('other disconnect', function(id) {
            var player = players.others[id];
            delete players.others[id];
            removePlayerAvatar(player);
        });

        socket.on('other change', function(data) {
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
        socket.emit('change', players.me);
    };
    
    world.onInit(init);
    
    return {
        playerMoved: playerMoved
    };
});
