'use strict';

define(['Three', 'Scenes', 'Events', 'World', 'Camera', 'KeyVR', 'PointerLock', 'Constants'], function(THREE, scenes, events, world, camera, keyVR, pointerLock, constants) {
    var raycaster;

    var move = {
        forward: false,
        left: false,
        right: false,
        backward: false
    };

    var canJump = true;
    var running = false;
    var velocity = new THREE.Vector3();
    var lastPosition = new THREE.Vector3();
    var floor;

    var collidableObjects = [];

    var controls = new THREE.PointerLockControls(camera);

    var init = function() {
        events.subscribe(events.list.pointerlockchange, function(locked) {
            controls.enabled = locked;
        });

        // If we stick to simple raycasting, collidable objects should contain all objects we want to intersect with using the raycaster
        // for now we just care about the floor -- FIXME hardcoded
        floor = scenes.getScene().getObjectByName('Floor');
        if (floor) {
            collidableObjects.push(floor);
        }

        controls.getObject().position.y = constants.firstPerson.INITIAL_Y;
        scenes.getScene().add(controls.getObject());

        var onKeyEvent = function(event) {
            var keyDown = event.type == constants.events.KEY_DOWN;

            switch (event.keyCode) {
                case constants.keyboard.UP:
                case constants.keyboard.W:
                    move.forward = keyDown;
                    break;
                case constants.keyboard.LEFT:
                case constants.keyboard.A:
                    move.left = keyDown;
                    break;
                case constants.keyboard.DOWN:
                case constants.keyboard.S:
                    move.backward = keyDown;
                    break;
                case constants.keyboard.RIGHT:
                case constants.keyboard.D:
                    move.right = keyDown;
                    break;
                case constants.keyboard.SPACE:
                    if (keyDown && canJump && (pointerLock.enabled() || keyVR.enabled())) {
                        velocity.y += constants.firstPerson.JUMP_SPEED;

                        // Comment out this line and people can fly :D
                        canJump = false;
                    }

                    break;
                case constants.keyboard.SHIFT:
                    running = keyDown;
                    break;
            }
        };

        document.addEventListener(constants.events.KEY_DOWN, onKeyEvent, false);
        document.addEventListener(constants.events.KEY_UP, onKeyEvent, false);

        keyVR.onKeyDown(onKeyEvent);
        keyVR.onKeyUp(onKeyEvent);
        keyVR.onMouseMove(controls.move);

        raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

        world.onLoop(animate);
    };

    var animate = function(time) {
        var restrainPosition = function(obj) {
            if (obj.position.y < constants.firstPerson.LOWEST_Y) {
                velocity.y = 0;
                obj.position.y = constants.firstPerson.LOWEST_Y;
                canJump = true;
            }
        };

        var obj = controls.getObject();
        raycaster.ray.origin.copy(obj.position);
        raycaster.ray.origin.y -= 10;
        var intersections = raycaster.intersectObjects(collidableObjects);
        var isOnObject = intersections.length > 0;
        var delta = time.delta / 1000;
        velocity.x -= velocity.x * constants.firstPerson.DECELERATION * delta;
        velocity.z -= velocity.z * constants.firstPerson.DECELERATION * delta;
        velocity.y -= constants.firstPerson.GRAVITY * constants.firstPerson.PLAYER_MASS * delta;

        var speed = running ? constants.firstPerson.RUNNING_SPEED : constants.firstPerson.WALKING_SPEED;

        if (pointerLock.enabled() || keyVR.enabled()) {
            if (move.forward) velocity.z -= speed * delta;
            if (move.backward) velocity.z += speed * delta;
            if (move.left) velocity.x -= speed * delta;
            if (move.right) velocity.x += speed * delta;
        }

        if (isOnObject) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }

        obj.translateX(velocity.x * delta);
        obj.translateY(velocity.y * delta);
        obj.translateZ(velocity.z * delta);

        restrainPosition(obj);

        if (!obj.position.equals(lastPosition)) {
            events.dispatch(events.list.playermoved, obj.position);
        }

        lastPosition.copy(obj.position);
    };

    var getPosition = function() {
        return controls.getObject().position;
    };

    world.onInit(init);

    return {
        controls: controls,
        getPosition: getPosition
    };
});
