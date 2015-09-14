'use strict';

define(['Scene'], function(scene) {

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
		unload: {list: []}
	};
	
	var browserEvents = Object.keys(events).filter(function(key) {
		return events[key].isBrowserEvent;
	});
	
	var dispatch = function(obj, event) {
		var array = obj.list;
		for (var i = 0, l = array.length; i < l; i++) {
			array[i](event);
		}
	};
	
	var addEventListeners = function() {
		for(var i = 0; i < browserEvents.length; i++) {
			var key = browserEvents[i];
			var callback = function(event) {
				dispatch(events[key], event);
			};
			events[key].callback = callback;
			document.addEventListener(key, callback);
		}
	};
	
	var removeEventListeners = function() {
		for(var i = 0; i < browserEvents.length; i++) {
			var key = browserEvents[i];				
			document.removeEventListener(key, events[key].callback);
		}
	};
	
	var loadScript = function(script, object, app) {
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

			events[name].push(functions[name].bind(object));
		}
	};

	var load = function(json, app) {
		for (var uuid in json) {
			var object = scene.getObjectByUUID(uuid);
			var scripts = json[uuid];

			for (var i = 0; i < scripts.length; i++) {
				loadScript(scripts[i], object, app);
			}
		}
	};

    return {
        events: events,
		load: load,
		dispatchEvent: dispatch,
		addEventListeners: addEventListeners,
		removeEventListeners: removeEventListeners
    };
});
