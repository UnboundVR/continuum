define(['World'], function(world) {
    // TODO put the name of these events in constants file
    var events = {
        keydown: {list: [], isBrowserEvent: true},
        keyup: {list: [], isBrowserEvent: true},
        mousedown: {list: [], isBrowserEvent: true},
        mouseup: {list: [], isBrowserEvent: true},
        mousemove: {list: [], isBrowserEvent: true},
        touchstart: {list: [], isBrowserEvent: true},
        touchend: {list: [], isBrowserEvent: true},
        touchmove: {list: [], isBrowserEvent: true},
        update: {list: []},
        start: {list: []},
        stop: {list: []},
        unload: {list: []},
        starthover: {list: []},
        endhover: {list: []},
        select: {list: []},
        pointerlockchange: {list: []}
    };

    var init = function() {
        world.onLoop(update);
    };

    var update = function(time) {
        dispatch(events.update, time);
    };

    var start = function() {
        browserEvents.forEach(function(browserEvent) {
            var callback = function(event) {
                dispatch(events[browserEvent], event);
            };

            events[browserEvent].callback = callback;
            document.addEventListener(browserEvent, callback);
        });

        dispatch(events.start);
    };

    var stop = function() {
        browserEvents.forEach(function(browserEvent) {
            document.removeEventListener(browserEvent, events[browserEvent].callback);
        });

        dispatch(events.stop);
    };

    var browserEvents = Object.keys(events).filter(function(key) {
        return events[key].isBrowserEvent;
    });

    var dispatch = function(obj, payload, uuid) {
        obj.list.forEach(function(handler) {
            if(!uuid || handler.uuid === uuid) {
                handler.func(payload);
            }
        });
    };

    var subscribe = function(event, callback) {
        event.list.push({func: callback});
    };

    world.onInit(init);
    world.onStart(start);
    world.onStop(stop);

    return {
        list: events,
        dispatch: dispatch,
        subscribe: subscribe
    }
});
