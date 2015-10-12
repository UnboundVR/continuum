var consts = require('../../shared/Constants');
var three = require('three.js');
var world = require('./World');
var scenes = require('./Scenes');
var camera = require('./Camera');
var events = require('./Events');

var vrMode = navigator.userAgent.match(consts.mobile.ANDROID_REGEX);
var webGLRenderer;
var css3DRenderer;

var init = function() {
    webGLRenderer = new three.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    webGLRenderer.setClearColor(consts.renderer.CLEAR_COLOR, 0.0);
    webGLRenderer.setPixelRatio(window.devicePixelRatio);
    webGLRenderer.shadowMap.enabled = true;
    webGLRenderer.shadowMap.type = three.PCFSoftShadowMap;
    webGLRenderer.domElement.id = 'webGLRenderer';

    css3DRenderer = new three.CSS3DRenderer();
    css3DRenderer.domElement.id = 'css3dRenderer';
    css3DRenderer.domElement.appendChild(webGLRenderer.domElement);

    // Init stereo effect if we're in VR mode
    // FIXME CSS3D renderer doesn't work with Cardboard, so for now HTML renders awkward in VR mode.
    if (vrMode) {
        webGLRenderer = new three.StereoEffect(webGLRenderer);
        webGLRenderer.eyeSeparation = 10;
    }

    setCamera(camera);

    window.addEventListener(consts.browserEvents.RESIZE, function() {
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

module.exports = {
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
