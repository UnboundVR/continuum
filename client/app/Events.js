define([], function() {
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
        init: {list: []},
        update: {list: []},
        start: {list: []},
        stop: {list: []},
        unload: {list: []},
        starthover: {list: []},
        endhover: {list: []},
        select: {list: []},
        pointerlockchange: {list: []},
        playermoved: {list: []},
        showhelp: {list: []},
        logout: {list: []},
        showsettings: {list: []},
        settingchanged: {list: []}
    };

    var dispatch = function(obj, payload, uuid) {
        obj.list.forEach(function(handler) {
            if (!uuid || handler.uuid === uuid) {
                handler.func(payload);
            }
        });
    };

    var subscribe = function(event, callback, uuid, scriptName) {
        event.list.push({
            func: callback,
            uuid: uuid,
            scriptName: scriptName
        });
    };

    var unsubscribeScript = function(uuid, scriptName) {
        for (var name in events) {
            events[name].list = events[name].list.filter(function(handler) {
                return handler.uuid !== uuid || (scriptName && handler.scriptName !== scriptName);
            });
        }
    };

    return {
        list: events,
        dispatch: dispatch,
        subscribe: subscribe,
        unsubscribeScript: unsubscribeScript
    };
});
