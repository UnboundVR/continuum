'use strict';

// SSAO from https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_ssao.html

define(['Three', 'World', 'Scenes', 'Camera', 'Constants'], function(THREE, world, scenes, camera, constants) {
    var vrMode = navigator.userAgent.match(constants.mobile.ANDROID_REGEX);
    var webGLRenderer;
    var css3DRenderer;

    var depthMaterial;
    var effectComposer
    var depthRenderTarget;
	var ssaoPass;
	var depthScale = 1.0;
	var postprocessingEnabled = true;

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

        // FIXME CSS3D renderer doesn't work with Cardboard, so for now HTML renders awkward in VR mode.
        if (vrMode) {
            webGLRenderer = new THREE.StereoEffect(webGLRenderer);
            webGLRenderer.eyeSeparation = 10;
        }

        setCamera(camera);

        window.addEventListener(constants.events.RESIZE, function() {
            setSize(window.innerWidth, window.innerHeight);
        });

        setSize(window.innerWidth, window.innerHeight);

        initPostprocessing(scenes.getScene(), webGLRenderer);
    };

    function initPostprocessing(scene, renderer) {
        var renderPass = new THREE.RenderPass( scene, camera );

        var depthShader = THREE.ShaderLib[ "depthRGBA" ];
        var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );
        depthMaterial = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader,
            uniforms: depthUniforms, blending: THREE.NoBlending } );
        var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
        depthRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );

        ssaoPass = new THREE.ShaderPass( THREE.SSAOShader );
        ssaoPass.renderToScreen = true;

        ssaoPass.uniforms[ "tDepth" ].value = depthRenderTarget;
        ssaoPass.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
        ssaoPass.uniforms[ 'cameraNear' ].value = camera.near;
        ssaoPass.uniforms[ 'cameraFar' ].value = camera.far;
        ssaoPass.uniforms[ 'onlyAO' ].value = false;
        ssaoPass.uniforms[ 'aoClamp' ].value = 0.3;
        ssaoPass.uniforms[ 'lumInfluence' ].value = 0.5;

        effectComposer = new THREE.EffectComposer( renderer );
        effectComposer.addPass( renderPass );
        effectComposer.addPass( ssaoPass );
    }

    var render = function() {
        if (postprocessingEnabled) {
			scenes.getScene().overrideMaterial = depthMaterial;
			webGLRenderer.render(scenes.getScene(), camera, depthRenderTarget, true);

			scenes.getScene().overrideMaterial = null;
			effectComposer.render();
		} else {
            webGLRenderer.render(scenes.getScene(), camera);
		}

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
