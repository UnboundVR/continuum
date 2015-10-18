var three = require('three.js');
var scenes = require('./Scenes');
var camera = require('./Camera');
var pointerLock = require('./PointerLock');
var events = require('./Events');
var editor = require('./Editor');
var world = require('./World');
var keyVR = require('./KeyVR');
var consts = require('../../shared/constants');

var isIntersecting = false;
var lastIntersected;

// TODO take this from a serious place (e.g. excluded objects could have a flag in scene.json?)
var excludedObjects = ['Floor', 'Skybox'];
var raycaster = new three.Raycaster();

var init = function() {
    window.addEventListener(consts.browserEvents.MOUSE_DOWN, onMouseDown, false);
    keyVR.onMouseDown(onMouseDown);

    world.onLoop(animate);
};

var isEnabled = function() {
    return pointerLock.enabled() || keyVR.enabled();
};

var animate = function() {
    if (!isEnabled()) {
        isIntersecting = false;
        return;
    }

    raycaster.setFromCamera(new three.Vector2(0, 0), camera);
    var intersects = raycaster.intersectObjects(scenes.getScene().children);

    intersects = intersects.filter(function(item) {
        return excludedObjects.indexOf(item.object.name) == -1;
    });

    isIntersecting = false;

    // TODO refactor below
    if (intersects.length) {
        var obj = intersects[0].object;

        if (lastIntersected != null && lastIntersected != obj) {
            onStopIntersect(lastIntersected);
        }

        if (obj != lastIntersected) {
            onIntersect(obj);
        }

        lastIntersected = obj;
        isIntersecting = true;
    }

    if (!isIntersecting) {
        if (lastIntersected != null) {
            onStopIntersect(lastIntersected);
        }

        lastIntersected = null;
    }
};

var onMouseDown = function(event) {
    if (isIntersecting) {
        switch (event.button) {
            case consts.mouse.LEFT_BUTTON:
                onSelect(lastIntersected);
                break;
            case consts.mouse.RIGHT_BUTTON:
                editor.rightClick(lastIntersected);
                break;
        }
    }
};

var onIntersect = function(obj) {
    lastIntersected = obj;
    events.dispatch(consts.events.START_HOVER, null, obj.uuid);
};

var onStopIntersect = function(obj) {
    events.dispatch(consts.events.END_HOVER, null, obj.uuid);
};

var onSelect = function(obj) {
    events.dispatch(consts.events.SELECT, null, obj.uuid);
};

world.onInit(init);

module.exports = {
    isIntersecting: function() {
        return isIntersecting;
    }
};
