define([], function() {
    var startCallbacks = [];
    var stopCallbacks = [];
    var initCallbacks = [];
    
    var firstTime = true;
    
    var start = function() {
        if(firstTime) {
            initCallbacks.forEach(function(callback) {
                callback();
            });
            
            firstTime = false;
        }
        
        startCallbacks.forEach(function(callback) {
            callback();
        });
    };
    
    var stop = function() {
        stopCallbacks.forEach(function(callback) {
            callback();
        });
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
    
    return {
        onStart: onInit,
        onStop: onStop,
        onInit: onInit,
        start: start,
        stop: stop
    };
});