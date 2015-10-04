'use strict';

define(['Three', 'Scenes', 'FirstPersonControls', 'Camera', 'PointerLock', 'Events', 'Editor', 'World', 'KeyVR', 'Constants'], function(THREE, scenes, controls, camera, pointerLock, events, editor, world, keyVR, constants) {
    var isIntersecting = false;
    var lastIntersected;

    // TODO take this from a serious place (e.g. excluded objects could have a flag in scene.json?)
    var excludedObjects = ['Floor', 'Skybox'];
    var raycaster = new THREE.Raycaster();

    var init = function() {
        window.addEventListener(constants.events.MOUSE_DOWN, onMouseDown, false);
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

        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
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
                case constants.mouse.LEFT_BUTTON:
                    onSelect(lastIntersected);
                    break;
                case constants.mouse.RIGHT_BUTTON:
                    editor.rightClick(lastIntersected);
                    break;
            }
        }
    };

    var onIntersect = function(obj) {
        lastIntersected = obj;
        events.dispatch(events.list.starthover, null, obj.uuid);
    };

    var onStopIntersect = function(obj) {
        events.dispatch(events.list.endhover, null, obj.uuid);
    };

    var onSelect = function(obj) {
        events.dispatch(events.list.select, null, obj.uuid);
    };

    world.onInit(init);

    return {
        isIntersecting: function() {
            return isIntersecting;
        }
    };
});
