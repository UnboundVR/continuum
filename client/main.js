'use strict';

require(['Detector', 'App', 'Container'], function(detector, app, container) {
    if (!detector.webgl) {
        detector.addGetWebGLMessage();
        container.innerHTML = '';
    }

    app.init();
});
