define(['Three', 'Container', 'VRMode', 'VREffect', 'WebVRManager', 'WebVRPolyfill'],
    function(THREE, container, vrMode, vrEffect, webVrManager, webVrPolyfill) {
        var VRRenderer = function(realRenderer) {
            var effect;
            var manager;
            if (vrMode.vr) {
                effect = new THREE.VREffect(realRenderer);
                manager = new webVrManager(realRenderer, effect);
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

        // FIXME CSS3D renderer will most likely not work with stereo effect -
        // we should test it and try with https://github.com/mrdoob/three.js/blob/master/examples/js/renderers/CSS3DStereoRenderer.js
        var css3DRenderer = new THREE.CSS3DRenderer();

        return {
            webGL: webGLVRRenderer,
            css3D: css3DRenderer
        };
    }
);

