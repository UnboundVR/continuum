'use strict';

// As THREE.js comes with many addons/plugins mix them all into one three object here
define( ['ThreeCore', 'OrbitControls', 'PointerLockControls', 'StereoEffect', 'CSS3DRenderer', 'RenderPass', 'SSAOShader', 'EffectComposer'], function( threeCore ) { 
  return threeCore;
} );
