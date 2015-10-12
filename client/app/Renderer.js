

define(['Three', 'World', 'Scenes', 'Camera', 'Constants', 'Events'], function(THREE, world, scenes, camera, constants, events) {
    var vrMode = navigator.userAgent.match(constants.mobile.ANDROID_REGEX);
    var webGLRenderer;
    var css3DRenderer;

    var init = function() {
        webGLRenderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        webGLRenderer.setClearColor(constants.renderer.CLEAR_COLOR, 0.0);
        webGLRenderer.setPixelRatio(window.devicePixelRatio);
        webGLRenderer.shadowMap.enabled = true;
        webGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        webGLRenderer.domElement.id = 'webGLRenderer';

        css3DRenderer = new THREE.CSS3DRenderer();
        css3DRenderer.domElement.id = 'css3dRenderer';
        css3DRenderer.domElement.appendChild(webGLRenderer.domElement);

        // Init stereo effect if we're in VR mode
        // FIXME CSS3D renderer doesn't work with Cardboard, so for now HTML renders awkward in VR mode.
        if (vrMode) {
            webGLRenderer = new THREE.StereoEffect(webGLRenderer);
            webGLRenderer.eyeSeparation = 10;
        }

        setCamera(camera);

        window.addEventListener(constants.browserEvents.RESIZE, function() {
            setSize(window.innerWidth, window.innerHeight);
        });

        setSize(window.innerWidth, window.innerHeight);
    };

    var render = function() {
        webGLRenderer.render(scenes.getScene(), camera);
        css3DRenderer.render(scenes.getCSS3DScene(), camera);
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
