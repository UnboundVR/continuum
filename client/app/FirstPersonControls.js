define(['Three', 'Container', 'Scene', 'Network'], function(THREE, container, scene, network) {
    var controls;
    var controlsEnabled = false;
    var raycaster;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var prevTime = performance.now();
    var velocity = new THREE.Vector3();

    // This array should contain all objects we want to intersect with (using the raycaster)
    // We should make the user fall if there is no floor, and add all the objects in the scene to this (e.g. including the floor)
    // so that the floor is the mesh that is "holding" the player
    var objects = [];

    var aspect = window.innerWidth / window.innerHeight;
    var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100000);

    // Based on https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
    var setupPointerLock = function() {
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
        if (controlsEnabled) {
            raycaster.ray.origin.copy(controls.getObject().position);
            raycaster.ray.origin.y -= 10;
            var intersections = raycaster.intersectObjects(objects);
            var isOnObject = intersections.length > 0;
            var time = performance.now();
            var delta = (time - prevTime) / 1000;
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 75.0 * delta; // 100.0 = mass
            if (moveForward) velocity.z -= 4000.0 * delta;
            if (moveBackward) velocity.z += 4000.0 * delta;
            if (moveLeft) velocity.x -= 4000.0 * delta;
            if (moveRight) velocity.x += 4000.0 * delta;
            if (isOnObject === true) {
                velocity.y = Math.max(0, velocity.y);
                canJump = true;
            }

            controls.getObject().translateX(velocity.x * delta);
            controls.getObject().translateY(velocity.y * delta);
            controls.getObject().translateZ(velocity.z * delta);
            if (controls.getObject().position.y < 10) {
                velocity.y = 0;
                controls.getObject().position.y = 10;
                canJump = true;
            }

            prevTime = time;

            network.playerMoved(controls.getObject().position);
        }
    };

    return {
        controls: controls,
        camera: camera,
        animate: animate,
        init: setupPointerLock,
    };
});
