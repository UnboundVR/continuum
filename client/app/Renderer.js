'use strict';

define(['Three', 'World', 'Scene', 'Camera'], function(THREE, world, scene, camera) {
    var vrMode = navigator.userAgent.match(/Android/i);
    var webGLRenderer;
    var css3DRenderer;

    var init = function() {
        webGLRenderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

        webGLRenderer.setClearColor(0x00ff00, 0.0);
        webGLRenderer.setPixelRatio(window.devicePixelRatio);

        webGLRenderer.domElement.style.position = 'absolute';
        webGLRenderer.domElement.style.zIndex = 1;
        webGLRenderer.domElement.style.top = 0;
        webGLRenderer.domElement.style.pointerEvents = 'none';

        webGLRenderer.shadowMap.enabled = true;
        webGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // FIXME CSS3D renderer doesn't work with Cardboard - we're dealing with this in a branch.
        // For now, no stereo effect for embedded HTML.
        css3DRenderer = new THREE.CSS3DRenderer();
        css3DRenderer.domElement.style.position = 'absolute';
        css3DRenderer.domElement.style.top = 0;
        css3DRenderer.domElement.appendChild(webGLRenderer.domElement);

        // Init stereo effect if we're in VR mode
        if (vrMode) {
            webGLRenderer = new THREE.StereoEffect(webGLRenderer);
            webGLRenderer.eyeSeparation = 10;
        }

        setCamera(camera);

        window.addEventListener('resize', function() {
            setSize(window.innerWidth, window.innerHeight);
        });

        setSize(window.innerWidth, window.innerHeight);
    };

    var render = function() {
        webGLRenderer.render(scene.getScene(), camera);
        css3DRenderer.render(scene.getCSS3DScene(), camera);
    };

    var setSize = function(width, height) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        webGLRenderer.setSize(width, height);
        css3DRenderer.setSize(width, height);
    };

    var setCamera = function(cam) {
        camera = cam;
        setSize(window.innerWidth, window.innerHeight);
    };

    world.onInit(init);
    world.onLoop(render);

    return {
        webGL: webGLRenderer,
        css3D: css3DRenderer,
        render: render,
        setSize: setSize,
        vrMode: vrMode,
        setCamera: setCamera,
        getDomElement: function() {
            return css3DRenderer.domElement;
        }
    };
});
