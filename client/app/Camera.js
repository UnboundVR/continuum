'use strict';

define(['Three', 'Constants'], function(THREE, constants) {
    var aspect = window.innerWidth / window.innerHeight;
    var camera = new THREE.PerspectiveCamera(constants.camera.FIELD_OF_VIEW, aspect, constants.camera.NEAR, constants.camera.FAR);

    return camera;
});
