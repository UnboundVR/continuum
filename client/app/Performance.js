define(['World'], function(world) {
    var fpsList = [];
    var fps = 0;

    var init = function() {
        world.onLoop(loop);
        world.onLoop(calculateFps, 1000);
    };

    var calculateFps = function() {
        var sum = function(a, b) {
            return a + b;
        };

        fps = fpsList.length ? fpsList.reduce(sum) / fpsList.length : 0;
        fpsList.length = 0;
    };

    var loop = function(time) {
        fpsList.push(1000.0 / time.delta);
    };

    world.onInit(init);

    return {
        currentFps: function() {
            return fps;
        }
    };
});
