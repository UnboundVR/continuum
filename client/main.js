var app = require('./app/App.js');

require('./app/Renderer');
require('./app/PointerLock');
require('./app/FirstPersonControls');
require('./app/ItemSelector');
require('./app/PlayerSync');
require('./app/Reticle');
require('./app/KeyVR');
require('./app/2dui/Container');
//require('./app/RTC');
require('./app/Performance');
require('./app/utils/BrowserEvents');

app.run();
