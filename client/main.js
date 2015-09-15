'use strict';

require(['Detector', 'App'], function(detector, app) {
    if (!detector.webgl) {
        detector.addGetWebGLMessage();
    }

    app.init();
});
