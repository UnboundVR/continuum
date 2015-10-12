

define(['Stats', 'Events', 'Constants', 'utils/Settings'], function(Stats, events, constants, settings) {
    var initialized = false;
    var request;
    var prevTime;
    var stats;

    var showStats = function() {
        stats.domElement.style.display = 'block';
    };

    var hideStats = function() {
        stats.domElement.style.display = 'none';
    };

    var initStats = function() {
        stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.body.appendChild(stats.domElement);

        if (!settings.get(constants.settings.IS_DEVELOPER)) {
            hideStats();
        }

        settings.onChange(constants.settings.IS_DEVELOPER, function(display) {
            (display ? showStats : hideStats)();
        });
    };

    var start = function() {
        if (!initialized) {
            initStats();
            events.dispatch(constants.events.INIT);
            initialized = true;
        }

        events.dispatch(constants.events.START);
        startLooping();
    };

    var stop = function() {
        stopLooping();
        events.dispatch(constants.events.STOP);
    };

    var loop = function(time) {
        stats.begin();
        events.dispatch(constants.events.UPDATE, {time: time, delta: time - prevTime});
        stats.end();

        prevTime = time;
        request = requestAnimationFrame(loop);
    };

    var startLooping = function() {
        request = requestAnimationFrame(loop);
        prevTime = performance.now();
    };

    var stopLooping = function() {
        cancelAnimationFrame(request);
    };

    var onStart = function(callback) {
        events.subscribe(constants.events.START, callback);
    };

    var onStop = function(callback) {
        events.subscribe(constants.events.STOP, callback);
    };

    var onInit = function(callback) {
        events.subscribe(constants.events.INIT, callback);
    };

    var onLoop = function(callback, interval) {
        if (interval === undefined) {
            events.subscribe(constants.events.UPDATE, callback);
        } else {
            setInterval(callback, interval);
        }
    };

    return {
        onStart: onStart,
        onStop: onStop,
        onInit: onInit,
        onLoop: onLoop,
        start: start,
        stop: stop
    };
});
