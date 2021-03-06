var consts = require('../../shared/constants');

var events = {};
Object.keys(consts.events).forEach(function(event) {
    event = consts.events[event];

    var addEvent = function(e) {
        events[e] = {
            list: []
        };
    };

    if (typeof event === 'object') {
        Object.keys(event).forEach(function(e) {
            addEvent(event[e]);
        });
    } else {
        addEvent(event);
    }
});

var dispatch = function(event, payload, uuid) {
    event = events[event];
    event.list.forEach(function(handler) {
        if (!uuid || handler.uuid === uuid) {
            handler.func(payload);
        }
    });
};

var subscribe = function(event, callback, uuid, scriptName) {
    event = events[event];
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

var list = function() {
    return Object.keys(events);
};

module.exports = {
    dispatch: dispatch,
    subscribe: subscribe,
    unsubscribeScript: unsubscribeScript,
    list: list
};
