'use strict';

define(['utils/CallbackList', 'Stats', 'Events', 'Constants', 'utils/Settings'], function(CallbackList, Stats, events, constants, settings) {
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

        if(!settings.get(constants.settings.IS_DEVELOPER)) {
            hideStats();
        }
        settings.onChange(constants.settings.IS_DEVELOPER, function(display) {
            (display ? showStats : hideStats)();
        });
    };

    var browserEvents = Object.keys(events).filter(function(key) {
        return events[key].isBrowserEvent;
    });

    var start = function() {
        browserEvents.forEach(function(browserEvent) {
            var callback = function(event) {
                dispatch(events[browserEvent], event);
            };

            events[browserEvent].callback = callback;
            document.addEventListener(browserEvent, callback);
        });

        initStats();

        if (!initialized) {
            events.dispatch(events.list.init);
            initialized = true;
        }

        events.dispatch(events.list.start);
        startLooping();
    };

    var stop = function() {
        browserEvents.forEach(function(browserEvent) {
            document.removeEventListener(browserEvent, events[browserEvent].callback);
        });

        stopLooping();
        events.dispatch(events.list.stop);
    };

    var loop = function(time) {
        stats.begin();
        events.dispatch(events.list.update, {time: time, delta: time - prevTime});
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
        events.subscribe(events.list.start, callback);
    };

    var onStop = function(callback) {
        events.subscribe(events.list.stop, callback);
    };

    var onInit = function(callback) {
        events.subscribe(events.list.init, callback);
    };

    var onLoop = function(callback) {
        events.subscribe(events.list.update, callback);
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
