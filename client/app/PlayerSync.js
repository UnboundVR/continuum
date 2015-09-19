'use strict';

define(['SocketIO', 'Scene', 'Auth'], function(io, scene, auth) {
    return {
        init: function() {
            var _this = this;
            
            this._socket = io.connect(window.location.origin + '/sync', {
                query: 'token=' + auth.getToken()
            });

            this.players = {
                me: {
                    name: 'YO',
                    position: new THREE.Vector3(0, 15, 0)
                },
                others: {}
            };

            this._socket.on('connect', function() {
                _this.players.me.id = this.id;
                _this._socket.emit('register', _this.players.me);
            });

            this._socket.on('other connect', function(other) {
                _this.players.others[other.id] = other;
                _this.addPlayerAvatar(other);
            });

            this._socket.on('other disconnect', function(id) {
                var player = _this.players.others[id];
                delete _this.players.others[id];
                _this.removePlayerAvatar(player);
            });

            this._socket.on('other change', function(data) {
                var player = _this.players.others[data.id];
                if (player) {
                    player.position = data.position;
                    player.mesh.position.copy(data.position);
                }
            });
        },

        removePlayerAvatar: function(player) {
            scene.getScene().remove(player.mesh);
        },

        addPlayerAvatar: function(player) {
            var geometry = new THREE.BoxGeometry(40, 40, 40);
            var texture = THREE.ImageUtils.loadTexture('client/assets/img/grass.jpg');
            var material = new THREE.MeshBasicMaterial({map: texture});

            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(player.position);

            player.mesh = mesh;

            scene.getScene().add(mesh);
        },

        playerMoved: function(position) {
            this.players.me.position = position;
            this._socket.emit('change', this.players.me);
        }
    };
});
