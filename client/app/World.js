define(['utils/ExecuteCallbacks'], function(executeCallbacks) {
    var startCallbacks = [];
    var stopCallbacks = [];
    var initCallbacks = [];
    var loopCallbacks = [];
    
    var initialized = false;
    var request;
    var prevTime;
    
    var start = function() {
        if(!initialized) {
            executeCallbacks(initCallbacks);
            initialized = true;
        }
        
        executeCallbacks(startCallbacks);
        startLooping();
    };
    
    var stop = function() {
        stopLooping();
        executeCallbacks(stopCallbacks);
    };
    
    var loop = function(time) {
        executeCallbacks(loopCallbacks, {time: time, delta: time - prevTime});
        
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
        startCallbacks.push(callback);
    };
    
    var onStop = function(callback) {
        stopCallbacks.push(callback);
    };
    
    var onInit = function(callback) {
        initCallbacks.push(callback);
    };
    
    var onLoop = function(callback) {
        loopCallbacks.push(callback);
    };
    
    return {
        onStart: onInit,
        onStop: onStop,
        onInit: onInit,
        onLoop: onLoop,
        start: start,
        stop: stop
    };
});