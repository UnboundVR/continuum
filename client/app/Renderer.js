define(['Three', 'Container', 'VRMode'], function(THREE, container, vrMode) {
    var Renderer = function() {
        var realRenderer = new THREE.WebGLRenderer({antialias: true});
        realRenderer.setClearColor(0x000000);
        realRenderer.setPixelRatio(window.devicePixelRatio);

        var effect;
        if (vrMode.vr) {
            effect = new THREE.StereoEffect(realRenderer);
            effect.eyeSeparation = 10;
            effect.setSize(window.innerWidth, window.innerHeight);
        }

        this.domElement = realRenderer.domElement;
        this._fullScreen = realRenderer._fullScreen;

        this.render = function(scene, camera) {
            if (vrMode.vr)
                effect.render(scene, camera);
            else
                realRenderer.render(scene, camera);
        };

        this.setSize = function(width, height) {
            if (vrMode.vr)
                effect.setSize(width, height);
            else
                realRenderer.setSize(width, height);
        };
    };

    return new Renderer();
});
