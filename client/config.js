'use strict';

// Configure Require.js
var require = {
    // Default load path for js files
    baseUrl: 'client/app',
    shim: {
        // --- Use shim to mix together all THREE.js subcomponents
        ThreeCore: {exports: 'THREE'},
        SocketIO: {exports: 'io'},
        OrbitControls: {deps: ['ThreeCore'], exports: 'THREE'},
        PointerLockControls: {deps: ['ThreeCore'], exports: 'THREE'},
        StereoEffect: {deps: ['ThreeCore'], exports: 'THREE'},
        CSS3DRenderer: {deps: ['ThreeCore'], exports: 'THREE'},
		
        /**
         * --- end THREE sub-components
         */

        Detector: {exports: 'Detector'},
        Stats: {exports: 'Stats'}
    },
    /**
     * --- Third party code lives in client/lib
     */
    paths: {
        // --- start THREE sub-components
        Three: '../lib/Three',
        ThreeCore: '/node_modules/three/three.min',
        OrbitControls: '../lib/controls/OrbitControls',
        PointerLockControls: '../lib/controls/PointerLockControls',
        StereoEffect: '../lib/effects/StereoEffect',
        CSS3DRenderer: '../lib/renderers/CSS3DRenderer',
        SocketIO: '/socket.io/socket.io',
        /**
         * --- end THREE sub-components
         */

        Detector: '../lib/Detector',
        Stats: 'lib/Stats.min',

        /**
         * --- Require.js plugins
         */
        Text: 'lib/require_plugins/Text',
        Shader: 'lib/require_plugins/Shader',

        /**
         * --- Where to look for shader files
         */
        shaders: 'shaders'
    }
};
