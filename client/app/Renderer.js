'use strict';

define(['Three', 'VRMode'], function(THREE, vrMode) {
    var webGLRenderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	webGLRenderer.setClearColor(0x00ff00, 0.0);
	webGLRenderer.setPixelRatio(window.devicePixelRatio);
	webGLRenderer.domElement.style.position = 'absolute';
	webGLRenderer.domElement.style.zIndex = 1;
	webGLRenderer.domElement.style.top = 0;
	webGLRenderer.domElement.style.pointerEvents = 'none';
    
	// FIXME CSS3D renderer doesn't work with Cardboard - we're dealing with this in a branch.
	// For now, no stereo effect for embedded HTML.
    var css3DRenderer = new THREE.CSS3DRenderer();
	css3DRenderer.domElement.style.position = 'absolute';
	css3DRenderer.domElement.style.top = 0;
	css3DRenderer.domElement.appendChild(webGLRenderer.domElement);
	
	// Init stereo effect if we're in VR mode
	if (vrMode.vr) {
		webGLRenderer = new THREE.StereoEffect(webGLRenderer);
		webGLRenderer.eyeSeparation = 10;
	}
		
	var render = function(scene, camera) {
		webGLRenderer.render(scene.getScene(), camera);
		css3DRenderer.render(scene.getCSS3DScene(), camera);
	};
	
	var setSize = function(width, height) {
		webGLRenderer.setSize(width, height);
		css3DRenderer.setSize(width, height);
	};

    return {
        webGL: webGLRenderer,
        css3D: css3DRenderer,
		render: render,
		setSize: setSize,
		domElement: css3DRenderer.domElement
    };
});
