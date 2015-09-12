define(['SocketIO', 'Scene'], function(io, scene) {
    return {
        init: function() {
            var _this = this;

            this.socket = io.connect();

            this.players = {
                me: {
                    name: 'YO',
                    position: new THREE.Vector3(),
                },
                others: {},
            };

            this.socket.on('connect', function() {
                _this.players.me.id = this.id;
                _this.socket.emit('register', _this.players.me);
            });

            this.socket.on('other connect', function(other) {
                _this.players.others[other.id] = other;
                _this.addPlayerAvatar(other);
            });

            this.socket.on('other disconnect', function(id) {
                var player = _this.players.others[id];
                delete _this.players.others[id];
                _this.removePlayerAvatar(player);
            });

            this.socket.on('other change', function(data) {
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

            // texture.anisotropy = Metavrse.renderer.getMaxAnisotropy();
            var material = new THREE.MeshBasicMaterial({map: texture});

            mesh = new THREE.Mesh(geometry, material);
            mesh.position = player.position;

            player.mesh = mesh;

            scene.getScene().add(mesh);
        },

        playerMoved: function(position) {
            this.players.me.position = position;
            this.socket.emit('change', this.players.me);
        },
    };
});
