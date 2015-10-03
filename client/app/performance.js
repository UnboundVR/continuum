define(['World'], function(world) {
    var init = function() {
        world.onLoop(loop);
    };

    var loop = function(time) {
        // TODO measure FPS
    };

    world.onInit(init);

    return {

    };
});
