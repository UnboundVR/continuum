'use strict';

// Configure Require.js
var require = {
    // Default load path for js files
    baseUrl: 'client/app',
    shim: {
        ThreeCore: {exports: 'THREE'},
        SocketIO: {exports: 'io'},
        OrbitControls: {deps: ['ThreeCore'], exports: 'THREE'},
        PointerLockControls: {deps: ['ThreeCore'], exports: 'THREE'},
        StereoEffect: {deps: ['ThreeCore'], exports: 'THREE'},
        CSS3DRenderer: {deps: ['ThreeCore'], exports: 'THREE'},
        VREffect: {deps: ['ThreeCore'], exports: 'THREE'},
        VRControls: {deps: ['ThreeCore'], exports: 'THREE'},
        WebVRManager: {deps: ['ThreeCore'], exports: 'WebVRManager'},
        WebVRPolyfill: {deps: ['ThreeCore'], exports: 'WebVRPolyfill'},
        Detector: {exports: 'Detector'},
        Stats: {exports: 'Stats'},
        Reticle: {exports: 'Reticle'}
    },
    paths: {
        Three: '../lib/Three',
        ThreeCore: '/node_modules/three/three.min',
        OrbitControls: '../lib/controls/OrbitControls',
        PointerLockControls: '../lib/controls/PointerLockControls',
        StereoEffect: '../lib/effects/StereoEffect',
        CSS3DRenderer: '../lib/renderers/CSS3DRenderer',
        VREffect: '../lib/effects/VREffect',
        VRControls: '../lib/controls/VRControls',
        Reticle: '../lib/vreticle/release/vreticle',
        WebVRManager: '../lib/webvr-manager',
        WebVRPolyfill: '../lib/webvr-polyfill/build/webvr-polyfill',
        SocketIO: '/socket.io/socket.io',
        Detector: '../lib/Detector',
        Stats: 'lib/Stats.min',
        Text: 'lib/require_plugins/Text',
        Shader: 'lib/require_plugins/Shader',
        shaders: 'shaders',
    }
};
