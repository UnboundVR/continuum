'use strict';

define(['Three', 'VRMode', 'Scene'], function(THREE, vrMode, scene) {
    var VRRenderer = function(realRenderer) {
        var effect;
        if (vrMode.vr) {
            effect = new THREE.StereoEffect(realRenderer);
            effect.eyeSeparation = 10;

            // effect.setSize(window.innerWidth, window.innerHeight);
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

    var webGLRenderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    webGLRenderer.setClearColor(0x00ff00, 0.0);
    webGLRenderer.setPixelRatio(window.devicePixelRatio);
    var webGLVRRenderer = new VRRenderer(webGLRenderer);

    // FIXME CSS3D renderer doesn't work with Cardboard - we're dealing with this in a branch.
	// For now, no stereo effect for embedded HTML.
    var css3DRenderer = new THREE.CSS3DRenderer();
	
	var render = function(camera) {
		this.webGL.render(scene.getScene(), camera);
		this.css3D.render(scene.getCSS3DScene(), camera);
	};

    return {
        webGL: webGLVRRenderer,
        css3D: css3DRenderer,
		render: render
    };
});
