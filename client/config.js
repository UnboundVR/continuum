'use strict';

var require = {
    baseUrl: 'client/app',
    shim: {
        ThreeCore: {exports: 'THREE'},
        OrbitControls: {deps: ['ThreeCore'], exports: 'THREE'},
        PointerLockControls: {deps: ['ThreeCore'], exports: 'THREE'},
        StereoEffect: {deps: ['ThreeCore'], exports: 'THREE'},
        CSS3DRenderer: {deps: ['ThreeCore'], exports: 'THREE'},
        EffectComposer: {deps: ['ThreeCore', 'MaskPass', 'ShaderPass', 'CopyShader'], exports: 'THREE'},
        ShaderPass: {deps: ['ThreeCore'], exports: 'THREE'},
        RenderPass: {deps: ['ThreeCore'], exports: 'THREE'},
        MaskPass: {deps: ['ThreeCore'], exports: 'THREE'},
        CopyShader: {deps: ['ThreeCore'], exports: 'THREE'},
        SSAOShader: {deps: ['ThreeCore'], exports: 'THREE'},
        THREETerrain: {deps: ['ThreeCore'], exports: 'THREE'},
        SocketIO: {exports: 'io'},
        Detector: {exports: 'Detector'},
        Stats: {exports: 'Stats'},
        RTCMultiConnection: {deps: ['GlobalSocketIO'], exports: 'RTCMultiConnection'},
    },
    paths: {
        // Three.js
        Three: '../lib/Three',
        ThreeCore: '/node_modules/three.js/build/three.min',
        OrbitControls: '../lib/controls/OrbitControls',
        PointerLockControls: '../lib/controls/PointerLockControls',
        StereoEffect: '../lib/effects/StereoEffect',
        CSS3DRenderer: '../lib/renderers/CSS3DRenderer',
        EffectComposer: '../lib/postprocessing/EffectComposer',
        ShaderPass: '../lib/postprocessing/ShaderPass',
        MaskPass: '../lib/postprocessing/MaskPass',
        RenderPass: '../lib/postprocessing/RenderPass',
        SSAOShader: '../lib/shaders/SSAOShader',
        CopyShader: '../lib/shaders/CopyShader',
        THREETerrain: '/node_modules/three.terrain.js/build/THREE.Terrain.min',

        // Misc
        Detector: '../lib/Detector',
        Stats: '../lib/Stats.min',
        SocketIO: '/socket.io/socket.io',
        GlobalSocketIO: '../lib/GlobalSocketIO',
        Tween: '/node_modules/tween.js/src/Tween',
        RTCMultiConnection: '/node_modules/rtcmulticonnection-v3/RTCMultiConnection.min',
        Constants: '../../shared/constants',

        // RequireJs plugins
        text: '../lib/requirejs/Text',
        html: '../lib/requirejs/HTML',
        i18n: '../lib/requirejs/i18n',

        // Folders
        shared: '../../shared',
        assets: '../assets'
    },
    deps: ['PointerLock', 'FirstPersonControls', 'ItemSelector', 'PlayerSync', 'Reticle', 'Renderer', 'KeyVR', '2dui/Container', 'RTC', 'Performance', 'Terrain']
};
