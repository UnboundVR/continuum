// Start the app
require(['Detector', 'App', 'Container'], function(detector, app, container) {
    if (!detector.webgl) {
        detector.addGetWebGLMessage();
        container.innerHTML = '';
    }

    // Initialize our app and start the animation loop (animate is expected to call itself)
    app.init();
});
