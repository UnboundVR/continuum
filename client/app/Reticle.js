'use strict';

define(['Three', 'Scene', 'FirstPersonControls', 'PointerLock', 'Tween', 'loaders/ScriptsLoader', 'Editor'], function(THREE, scene, controls, pointerLock, tween, scripts, editor) {
    var mouse = new THREE.Vector2();
    var isIntersecting = false;
    var lastIntersected = null;

    // TODO take this from a serious place (e.g. excluded objects could have a flag in scene.json?)
    var excludedObjects = ['Floor', 'Skybox'];

    // Based on the example in http://threejs.org/docs/#Reference/Core/Raycaster
    var onMouseMove = function(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    var onMouseDown = function(event) {
        if (isIntersecting && pointerLock.enabled()) {
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

    // TODO perhaps we could pass time hovered as the event payload
    var onIntersect = function(obj) {
        lastIntersected = obj;
        scripts.dispatchEvent(scripts.events.starthover, null, obj.uuid);
    };

    var onStopIntersect = function(obj) {
        scripts.dispatchEvent(scripts.events.starthover, null, obj.uuid);
    };

    var onSelect = function(obj) {
        scripts.dispatchEvent(scripts.events.select, null, obj.uuid);
    };

    var loop = function() {
        /* This would use the mouse position, not the reticle position. Might be useful in the future (e.g. for KeyVR)
        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(controls.camera);
        var raycaster = new THREE.Raycaster(controls.getPosition(), vector.sub(controls.getPosition()).normalize());
        */

        if (!pointerLock.enabled()) {
			hideReticle();
            return;
        }
		
		showReticle();

        // FIXME This magic vector was taken from https://github.com/neuman/vreticle
        // It probably represents the position of the reticle.
        var vector = new THREE.Vector3(-0.0012499999999999734, -0.0053859964093356805, 0.5);
        vector.unproject(controls.camera);
        var raycaster = new THREE.Raycaster(controls.getPosition(), vector.sub(controls.getPosition()).normalize());

        var intersects = raycaster.intersectObjects(scene.getScene().children);
        isIntersecting = false;
        if (intersects.length) {
            var obj = intersects[0].object;
            if (!excludedObjects.some(function(exc) {
                return exc == obj.name;
            })) {

                if (lastIntersected != null && lastIntersected != obj) {
                    onStopIntersect(lastIntersected);
                }

                if (obj != lastIntersected) {
                    onIntersect(obj);
                }

                lastIntersected = obj;
                isIntersecting = true;
            }
        }

        if (!isIntersecting) {
            if (lastIntersected != null) {
                onStopIntersect(lastIntersected);
            }

            lastIntersected = null;
        }
    };

    var createReticle = function() {
        var geometry = new THREE.CircleGeometry(0.05, 16);
        geometry.vertices.shift();
        var material = new THREE.LineBasicMaterial();
        material.color.set(0x000000);

        var mesh = new THREE.Line(geometry, material);
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = -10;

        return mesh;
    };
	
	var hideReticle = function() {
		reticle.visible = false;
	};
	
	var showReticle = function() {
		reticle.visible = true;
	};

    var init = function() {
        window.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('mousedown', onMouseDown, false);

        var reticleContainer = new THREE.Object3D();
        reticleContainer.add(reticle);
        controls.camera.add(reticleContainer);
    };

    var reticle = createReticle();

    return {
        loop: loop,
        init: init
    };
});
