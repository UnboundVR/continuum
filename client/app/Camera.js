define(['Three'], function(THREE) {
    var aspect = window.innerWidth / window.innerHeight;
    var camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100000);

    return camera;
});
