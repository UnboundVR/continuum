'use strict';

define(['Scene'], function(scene) {
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

    var addEventListeners = function() {
        browserEvents.forEach(function(browserEvent) {
            var callback = function(event) {
                dispatch(events[browserEvent], event);
            };

            events[browserEvent].callback = callback;
            document.addEventListener(browserEvent, callback);
        });
    };

    var removeEventListeners = function() {
        browserEvents.forEach(function(browserEvent) {
            document.removeEventListener(browserEvent, events[browserEvent].callback);
        });
    };

    var removeOldScript = function(script, uuid) {
        dispatch(events.unload, null, uuid);

        for (var name in events) {
            events[name].list = events[name].list.filter(function(handler) {
                return handler.uuid !== uuid || handler.scriptName !== script.name;
            });
        }
    };

    var doLoadScript = function(script, uuid, app) {
        var object = scene.getObjectByUUID(uuid);
        var params = 'app, scene, ' + Object.keys(events).join(', ');
        var source = script.source + '\nreturn {' + Object.keys(events).map(function(key) {
            return key + ': ' + key;
        }).join(', ') + '};';
        var functions = (new Function(params, source).bind(object))(app, scene.getScene());

        for (var name in functions) {
            if (functions[name] === undefined) {
                continue;
            }

            if (events[name] === undefined) {
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

    var loadScript = function(script, uuid) {
        removeOldScript(script, uuid);
        doLoadScript(script, uuid, this._app);
    };
    
    var getScript = function(objUUID, scriptName) {
        return scripts[objUUID][scriptName];
    };
    
    var getScripts = function(objUUID) {
        return scripts[objUUID];
    };

    var load = function(json, app) {
        this._app = app;

        var scriptDict = {};
        json.scripts.forEach(function(entry) {
            scriptDict[entry.uuid] = {
                name: entry.name,
                source: entry.source
            };
        });
        
        var storeScript = function(script, objUUID) {
            if(!scripts[objUUID]) {
                scripts[objUUID] = {};
            }
            
            scripts[objUUID][script.name] = script.source;
        };
        
        var loadScriptForObjects = function(objs) {
            objs.forEach(function(obj) {
                if (obj.scripts && obj.scripts.length) {
                    obj.scripts.forEach(function(scriptUUID) {
                        storeScript(scriptDict[scriptUUID], obj.uuid);
                        doLoadScript(scriptDict[scriptUUID], obj.uuid, app);
                    });
                }

                if (obj.children) {
                    loadScriptForObjects(obj.children);
                }
            });
        };
        
        loadScriptForObjects([json.scene.object]);
    };

    return {
        events: events,
        getScript: getScript,
        getScripts: getScripts,
        load: load,
        loadScript: loadScript,
        dispatchEvent: dispatch,
        addEventListeners: addEventListeners,
        removeEventListeners: removeEventListeners
    };
});
