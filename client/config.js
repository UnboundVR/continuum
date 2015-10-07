'use strict';

var require = {
    baseUrl: 'client/app',
    shim: {
        ThreeCore: {exports: 'THREE'},
        OrbitControls: {deps: ['ThreeCore'], exports: 'THREE'},
        PointerLockControls: {deps: ['ThreeCore'], exports: 'THREE'},
        StereoEffect: {deps: ['ThreeCore'], exports: 'THREE'},
        CSS3DRenderer: {deps: ['ThreeCore'], exports: 'THREE'},
        Detector: {exports: 'Detector'},
        SocketIO: {exports: 'io'},
        Stats: {exports: 'Stats'},
        RTCMultiConnection: {deps: ['GlobalSocketIO'], exports: 'RTCMultiConnection'}
    },
    paths: {
        // Three.js
        Three: '../lib/Three',
        ThreeCore: '/node_modules/three.js/build/three.min',
        OrbitControls: '../lib/controls/OrbitControls',
        PointerLockControls: '../lib/controls/PointerLockControls',
        StereoEffect: '../lib/effects/StereoEffect',
        CSS3DRenderer: '../lib/renderers/CSS3DRenderer',

        // Misc
        SocketIO: '/socket.io/socket.io',
        Detector: '../lib/Detector',
        Stats: '../lib/Stats.min',
        Tween: '/node_modules/tween.js/src/Tween',
        RTCMultiConnection: '/node_modules/rtcmulticonnection-v3/RTCMultiConnection.min',
        GlobalSocketIO: '../lib/GlobalSocketIO',
        Constants: '../../shared/constants',

        // RequireJs plugins
        text: '../lib/requirejs/Text',
        html: '../lib/requirejs/HTML',
        i18n: '../lib/requirejs/i18n',

        // Folders
        shared: '../../shared',
        assets: '../assets'
    },
    deps: ['PointerLock', 'FirstPersonControls', 'ItemSelector', 'PlayerSync', 'Reticle', 'Renderer', 'KeyVR', '2dui/Container', 'RTC', 'Performance']
};
