var THREE = require('three.js');
var consts = require('../../shared/constants');

var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(consts.camera.FIELD_OF_VIEW, aspect, consts.camera.NEAR, consts.camera.FAR);

module.exports = camera;
