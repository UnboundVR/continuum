var THREE = require('three.js');
window.THREE = THREE;

var app = require('./app/App.js');

// three.js stuff
// require('./lib/three.js/controls/OrbitControls'); // currently unused
require('./lib/three.js/controls/PointerLockControls');
require('./lib/three.js/effects/StereoEffect');
require('./lib/three.js/renderers/CSS3DRenderer');
require('three.terrain.js');

// Modules that register to world
require('./app/Renderer');
require('./app/PointerLock');
require('./app/FirstPersonControls');
require('./app/ItemSelector');
// require('./app/PlayerSync');
require('./app/Reticle');
// require('./app/KeyVR');
require('./app/2dui/Container');
// require('./app/RTC');
require('./app/Performance');
require('./app/utils/BrowserEvents');
require('./app/Terrain');

app.run();
