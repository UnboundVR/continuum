'use strict';

define(['Three', 'Scene', 'FirstPersonControls', 'Camera', 'PointerLock', 'ScriptsManager', 'Editor', 'World', 'KeyVR'], function(THREE, scene, controls, camera, pointerLock, scripts, editor, world, keyVR) {
    var isIntersecting = false;
    var lastIntersected;

    // TODO take this from a serious place (e.g. excluded objects could have a flag in scene.json?)
    var excludedObjects = ['Floor', 'Skybox'];
    var mouse = {};

    var init = function() {
        window.addEventListener('mousedown', onMouseDown, false);
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

        // FIXME This magic vector was taken from https://github.com/neuman/vreticle
        // It probably represents the position of the reticle.
        var vector = new THREE.Vector3(-0.0012499999999999734, -0.0053859964093356805, 0.5);
        vector.unproject(camera);
        var raycaster = new THREE.Raycaster(controls.getPosition(), vector.sub(controls.getPosition()).normalize());
        var intersects = raycaster.intersectObjects(scene.getScene().children);

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
                case 0:
                    onSelect(lastIntersected);
                    break;
                case 2:
                    editor.rightClick(lastIntersected);
                    break;
            }
        }
    };

    var onIntersect = function(obj) {
        lastIntersected = obj;
        scripts.dispatchEvent(scripts.events.starthover, null, obj.uuid);
    };

    var onStopIntersect = function(obj) {
        scripts.dispatchEvent(scripts.events.endhover, null, obj.uuid);
    };

    var onSelect = function(obj) {
        scripts.dispatchEvent(scripts.events.select, null, obj.uuid);
    };

    world.onInit(init);

    return {
        isIntersecting: function() {
            return isIntersecting;
        }
    };
});
