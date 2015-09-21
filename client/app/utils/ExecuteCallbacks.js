define([], function() {
    var executeCallbacks = function(callbacks, payload) {
        callbacks.forEach(function(callback) {
            callback(payload);
        });
    };

    return executeCallbacks;
});