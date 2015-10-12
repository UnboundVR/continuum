var app = require('./app/App.js');

// three.js stuff
require('./lib/controls/OrbitControls'); // currently unused
require('./lib/controls/PointerLockControls');
require('./lib/effects/StereoEffect');
require('./lib/renderers/CSS3DRenderer');

// Modules that register to world
require('./app/Renderer');
require('./app/PointerLock');
require('./app/FirstPersonControls');
require('./app/ItemSelector');
require('./app/PlayerSync');
require('./app/Reticle');
require('./app/KeyVR');
//require('./app/2dui/Container');
//require('./app/RTC');
require('./app/Performance');
require('./app/utils/BrowserEvents');

app.run();
