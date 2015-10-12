var three = require('./three.js');
var consts = require('../../shared/Constants');

var aspect = window.innerWidth / window.innerHeight;
var camera = new three.PerspectiveCamera(consts.camera.FIELD_OF_VIEW, aspect, consts.camera.NEAR, consts.camera.FAR);

module.exports = camera;
