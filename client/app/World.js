define(['utils/CallbackList'], function(CallbackList) {
    var startCallbacks = new CallbackList();
    var stopCallbacks = new CallbackList();
    var initCallbacks = new CallbackList();
    var loopCallbacks = new CallbackList();
    
    var initialized = false;
    var request;
    var prevTime;
    
    var start = function() {
        if(!initialized) {
            initCallbacks.execute();
            initialized = true;
        }
        
        startCallbacks.execute();
        startLooping();
    };
    
    var stop = function() {
        stopLooping();
        stopCallbacks.execute();
    };
    
    var loop = function(time) {
        loopCallbacks.execute({time: time, delta: time - prevTime});
        
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
    
    return {
        onStart: startCallbacks.push,
        onStop: stopCallbacks.push,
        onInit: initCallbacks.push,
        onLoop: loopCallbacks.push,
        start: start,
        stop: stop
    };
});