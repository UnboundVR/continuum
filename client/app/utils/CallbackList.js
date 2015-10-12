var CallbackList = function() {
    var callbacks = [];

    this.execute = function(payload) {
        callbacks.forEach(function(callback) {
            callback(payload);
        });
    };

    this.push = function(item) {
        callbacks.push(item);
    };
};

module.exports = CallbackList;
