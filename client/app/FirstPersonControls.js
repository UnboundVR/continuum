"use strict";

define(['Three', 'Container', 'Scene', 'Network'], function(THREE, container, scene, network) {
    var controls;
    var controlsEnabled = false;
    var raycaster;
	var canJump = true;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var prevTime = performance.now();
    var velocity = new THREE.Vector3();

    // This array should contain all objects we want to intersect with using the raycaster - for now we just care about the floor
	// Later on we should probably use a richer collision detection mechanism, such as http://www.threejsgames.com/extensions/
    var collidableObjects = [];

    var aspect = window.innerWidth / window.innerHeight;
    var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100000);

    // Based on https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
    var setupPointerLock = function() {
		this.floor = scene.getScene().getObjectByName('Floor');
		if(this.floor !== undefined) {
			collidableObjects.push(this.floor);
		}
        var blocker = document.getElementById('blocker');
        var instructions = document.getElementById('instructions');

        // http://www.html5rocks.com/en/tutorials/pointerlock/intro/
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

        if (havePointerLock) {
            var element = document.body;
            var pointerlockchange = function(event) {
                if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                    controlsEnabled = true;
                    controls.enabled = true;
                    blocker.style.display = 'none';
                } else {
					controlsEnabled = false;
                    controls.enabled = false;
                    blocker.style.display = '-webkit-box';
                    blocker.style.display = '-moz-box';
                    blocker.style.display = 'box';
                    instructions.style.display = '';
                }
            };

            var pointerlockerror = function(event) {
                instructions.style.display = '';
            };

            // Hook pointer lock state change events
            document.addEventListener('pointerlockchange', pointerlockchange, false);
            document.addEventListener('mozpointerlockchange', pointerlockchange, false);
            document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
            document.addEventListener('pointerlockerror', pointerlockerror, false);
            document.addEventListener('mozpointerlockerror', pointerlockerror, false);
            document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
            instructions.addEventListener('click', function(event) {
                instructions.style.display = 'none';

                // Ask the browser to lock the pointer
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                if (/Firefox/i.test(navigator.userAgent)) {
                    var fullscreenchange = function(event) {
                        if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                            document.removeEventListener('fullscreenchange', fullscreenchange);
                            document.removeEventListener('mozfullscreenchange', fullscreenchange);
                            element.requestPointerLock();
                        }
                    };

                    document.addEventListener('fullscreenchange', fullscreenchange, false);
                    document.addEventListener('mozfullscreenchange', fullscreenchange, false);
                    element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                    element.requestFullscreen();
                } else {
                    element.requestPointerLock();
                }
            }, false);
        } else {
            instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
        }

        // From here onwards was the init in the example from mr doob
        controls = new THREE.PointerLockControls(camera);
		controls.getObject().position.y = 15;
        scene.getScene().add(controls.getObject());
		
        var onKeyDown = function(event) {
            switch (event.keyCode) {
                case 38: // up
                case 87: // w
                    moveForward = true;
                    break;
                case 37: // left
                case 65: // a
                    moveLeft = true;
                    break;
                case 40: // down
                case 83: // s
                    moveBackward = true;
                    break;
                case 39: // right
                case 68: // d
                    moveRight = true;
                    break;
                case 32: // space
                    if (canJump === true) velocity.y += 350;
                    canJump = false;
                    break;
            }
        };

        var onKeyUp = function(event) {
            switch (event.keyCode) {
                case 38: // up
                case 87: // w
                    moveForward = false;
                    break;
                case 37: // left
                case 65: // a
                    moveLeft = false;
                    break;
                case 40: // down
                case 83: // s
                    moveBackward = false;
                    break;
                case 39: // right
                case 68: // d
                    moveRight = false;
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);
        raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
    };

    var animate = function() {
		var time = performance.now();
		
		var restrainPosition = function(obj) {
			// This guarantees that the player won't fall
			if (obj.position.y < -5) {
				velocity.y = 0;
				obj.position.y = -5;
				canJump = true;
			}
			
			// This bounds the player to a plane a little (10%) larger than the floor plane
			if(obj.position.x > 550) {
				obj.position.x = 550;
			}
			if(obj.position.x < -550) {
				obj.position.x = -550;
			}
			if(obj.position.z > 550) {
				obj.position.z = 550;
			}
			if(obj.position.z < -550) {
				obj.position.z = -550;
			}
		};
		
        if (controlsEnabled) {
			var obj = controls.getObject();
            raycaster.ray.origin.copy(obj.position);
            raycaster.ray.origin.y -= 10;
            var intersections = raycaster.intersectObjects(collidableObjects);
            var isOnObject = intersections.length > 0;
            var delta = (time - prevTime) / 1000;
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 75.0 * delta; // 75.0 = mass
            if (moveForward) velocity.z -= 4000.0 * delta;
            if (moveBackward) velocity.z += 4000.0 * delta;
            if (moveLeft) velocity.x -= 4000.0 * delta;
            if (moveRight) velocity.x += 4000.0 * delta;
            if (isOnObject === true) {
                velocity.y = Math.max(0, velocity.y);
                canJump = true;
            }
			
            obj.translateX(velocity.x * delta);
			obj.translateY(velocity.y * delta);
            obj.translateZ(velocity.z * delta);
            
			restrainPosition(obj);

            network.playerMoved(obj.position);
        }
		prevTime = time;
    };

    return {
        controls: controls,
        camera: camera,
        animate: animate,
        init: setupPointerLock,
    };
});
