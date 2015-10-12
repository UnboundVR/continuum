var consts = require('../../shared/Constants');
var events = require('./Events');
var stats = require('stats.js');
var settings = require('./utils/Settings');

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

    if (!settings.get(consts.settings.IS_DEVELOPER)) {
        hideStats();
    }

    settings.onChange(consts.settings.IS_DEVELOPER, function(display) {
        (display ? showStats : hideStats)();
    });
};

var start = function() {
    if (!initialized) {
        initStats();
        events.dispatch(consts.events.INIT);
        initialized = true;
    }

    events.dispatch(consts.events.START);
    startLooping();
};

var stop = function() {
    stopLooping();
    events.dispatch(consts.events.STOP);
};

var loop = function(time) {
    stats.begin();
    events.dispatch(consts.events.UPDATE, {time: time, delta: time - prevTime});
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
    events.subscribe(consts.events.START, callback);
};

var onStop = function(callback) {
    events.subscribe(consts.events.STOP, callback);
};

var onInit = function(callback) {
    events.subscribe(consts.events.INIT, callback);
};

var onLoop = function(callback, interval) {
    if (interval === undefined) {
        events.subscribe(consts.events.UPDATE, callback);
    } else {
        setInterval(callback, interval);
    }
};

module.exports = {
    onStart: onStart,
    onStop: onStop,
    onInit: onInit,
    onLoop: onLoop,
    start: start,
    stop: stop
};
