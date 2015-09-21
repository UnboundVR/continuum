define(['utils/CallbackList', 'Stats'], function(CallbackList, Stats) {
    var startCallbacks = new CallbackList();
    var stopCallbacks = new CallbackList();
    var initCallbacks = new CallbackList();
    var loopCallbacks = new CallbackList();
    
    var initialized = false;
    var request;
    var prevTime;
    var stats;
    
    var initStats = function() {
        stats = new Stats();
        stats.setMode(0);
        
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.body.appendChild( stats.domElement );
    };
    
    var start = function() {
        initStats();
        
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
        stats.begin();
        loopCallbacks.execute({time: time, delta: time - prevTime});
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
    
    return {
        onStart: startCallbacks.push,
        onStop: stopCallbacks.push,
        onInit: initCallbacks.push,
        onLoop: loopCallbacks.push,
        start: start,
        stop: stop
    };
});