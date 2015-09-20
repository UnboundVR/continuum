'use strict';

define(['Scene', 'Loop', 'World'], function(scene, loop, world) {
    var scripts = {};

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
        unload: {list: []},
        starthover: {list: []},
        endhover: {list: []},
        select: {list: []},
        pointerlock: {list: []},
        pointerunlock: {list: []}
    };
    
    var app;
    
    var init = function() {
        loop.onLoop(update);
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
    };
    
    var stop = function() {
        browserEvents.forEach(function(browserEvent) {
            document.removeEventListener(browserEvent, events[browserEvent].callback);
        });
    };

    var browserEvents = Object.keys(events).filter(function(key) {
        return events[key].isBrowserEvent;
    });

    var dispatch = function(obj, payload, uuid) {
        var array = obj.list;
        for (var i = 0, l = array.length; i < l; i++) {
            if (uuid === undefined || uuid === array[i].uuid) {
                array[i].func(payload);
            }
        }
    };

    var unloadOldScript = function(script, uuid) {
        dispatch(events.unload, null, uuid);

        for (var name in events) {
            events[name].list = events[name].list.filter(function(handler) {
                return handler.uuid !== uuid || handler.scriptName !== script.name;
            });
        }
    };
    
    var loadScript = function(script, uuid) {
        var scriptExists = function() {
            if(!scripts[uuid]) {
                return false;
            }
            
            return scripts[uuid].hasOwnProperty(script.name);
        };
        
        var storeScript = function() {
            if(!scripts[uuid]) {
                scripts[uuid] = {};
            }
            
            scripts[uuid][script.name] = script.source;
        };
        
        if(scriptExists()) {
            unloadOldScript(script, uuid);
        }
        
        storeScript();
        
        var object = scene.getObjectByUUID(uuid);
        var params = 'app, scene, ' + Object.keys(events).join(', ');
        var source = script.source + '\nreturn {' + Object.keys(events).map(function(key) {
            return key + ': ' + key;
        }).join(', ') + '};';
        var functions = (new Function(params, source).bind(object))(app, scene.getScene());

        for (var name in functions) {
            if (!functions[name]) {
                continue;
            }

            if (!events[name]) {
                console.warn('Event type not supported (', name, ')');
                continue;
            }

            events[name].list.push({
                func: functions[name].bind(object),
                uuid: object.uuid,
                scriptName: script.name
            });
        }
    };

    var getScript = function(objUUID, scriptName) {
        return scripts[objUUID][scriptName];
    };
    
    var getScripts = function(objUUID) {
        return scripts[objUUID];
    };
    
    var setApp = function(relevantApp) {
        app = relevantApp;
    };
    
    world.onInit(init);
    world.onStart(start);
    world.onStop(stop);
    
    return {
        events: events,
        getScript: getScript,
        getScripts: getScripts,
        loadScript: loadScript,
        dispatchEvent: dispatch,
        setApp: setApp
    };
});
