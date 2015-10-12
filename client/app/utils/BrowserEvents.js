

define(['World', 'Constants', 'Events'], function(world, constants, events) {
    var callbacks = [];

    var hook = function() {
        Object.keys(consts.events.browserEvents).forEach(function(browserEvent) {
            var callback = function(e) {
                events.dispatch(consts.events.browserEvents[browserEvent], e);
            };

            callbacks.push({callback: callback, event: browserEvent});
            document.addEventListener(browserEvent, callback);
        });
    };

    var unhook = function() {
        callbacks.forEach(function(item) {
            document.removeEventListener(item.event, item.callback);
        });

        callbacks.length = 0;
    };

    world.onStart(hook);
    world.onStop(unhook);
});
