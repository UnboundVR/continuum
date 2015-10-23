// Creates, moves and deletes other player's avatars.

var scenes = require('../Scenes');
var requests = require('../utils/Requests');
var THREE = require('three.js');

var getAvatar = function(objectUrl) {
    return requests.get(objectUrl, false).then(function(json) {
        var loader = new THREE.ObjectLoader();

        return new Promise(function(resolve, reject) {
            // TODO what happens if this throws an error?
            loader.parse(json, function(obj) {
                resolve(obj);
            });
        });
    });
};

var move = function(player) {
    if(player.mesh) {
        player.mesh.position.copy(player.position);
        player.mesh.rotation.y = player.rotation;
    }
};

var remove = function(player) {
    if(player.mesh) {
        scenes.getScene().remove(player.mesh);
    }
};

var add = function(player) {
    return getAvatar('http://metavrse.io/public/avatar/avatar.json').then(function(obj){
        obj.position.copy(player.position);

        var text = getText(player);
        obj.add(text);

        return getSpeakingSign().then(function(sign) {
            obj.add(sign);
            player.speakingSign = sign;

            player.mesh = obj;
            scenes.getScene().add(player.mesh);
        });
    });
};

var getText = function(player) {
    var canvas = document.createElement('canvas');
    var size = 512;
    canvas.width = size;
    canvas.height = size;
    var context = canvas.getContext('2d');
    context.fillStyle = '#00ff00';
    context.textAlign = 'center';
    context.font = '36px Arial';
    context.fillText(player.name, size / 2, size / 2);

    var map = new THREE.Texture(canvas);
    map.needsUpdate = true;

    var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true });
    var text = new THREE.Sprite(material);
    text.scale.set(50, 50, 1);
    text.position.set(0, 25, 0);

    return text;
}

var getSpeakingSign = function() {
    return new Promise(function(resolve, reject) {
        var canvas = document.createElement('canvas');
        var size = 512;
        canvas.width = size;
        canvas.height = size;
        var context = canvas.getContext('2d');

        var image = new Image();
        image.addEventListener('load', function() {
            context.drawImage(image, 41, 94);

            var map = new THREE.Texture(canvas);
            map.needsUpdate = true;

            var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true });
            var sign = new THREE.Sprite(material);
            sign.scale.set(50, 50, 1);
            sign.position.set(20, 25, 0);
            sign.visible = false;

            resolve(sign);
        }, false);

        image.onerror = function(err) {
            reject(err);
        };

        image.src = '/assets/img/speaking.png';
    });
}

var toggleSpeakingFeedback = function(player, speaking) {
    player.speakingSign.visible = speaking;
};

module.exports = {
    add: add,
    remove: remove,
    move: move,
    toggleSpeakingFeedback: toggleSpeakingFeedback
};
