define(['World', 'PointerLock'], function(world, pointerLock) {

    var init = function() {
        drawUI();

        pointerLock.onChange(function(locked) {
            if (!locked) {
                enableUI();
            } else {
                disableUI();
            }
        });
    };

    var drawUI = function() {

    };

    var enableUI = function() {

    };

    var disableUI = function() {

    };

    world.onInit(init);

    return {

    };
});
