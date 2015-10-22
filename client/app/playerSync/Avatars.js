// Creates, moves and deletes other player's avatars.

var scenes = require('../Scenes');
var requests = require('../utils/Requests');
var THREE = require('three.js');

var move = function(player) {
    player.mesh.position.copy(player.position);
};

var remove = function(player) {
    scenes.getScene().remove(player.mesh);
};

var add = function(player) {
    requests.get('http://metavrse.io/public/avatar/avatar.json', false).then(function(json){
        var loader = new THREE.ObjectLoader();
        loader.parse(json, function(obj){
            obj.position.copy(player.position);

            var text = getText(player);
            obj.add(text);

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

var toggleSpeakingFeedback = function(player) {
    var canvas = document.createElement('canvas');
    var size = 512;
    canvas.width = size;
    canvas.height = size;
    var context = canvas.getContext('2d');

    var image = new Image();
    image.src = '/assets/img/speaking.png';
    context.drawImage(image, 41, 94);
};

module.exports = {
    add: add,
    remove: remove,
    move: move,
    toggleSpeakingFeedback: toggleSpeakingFeedback
};
