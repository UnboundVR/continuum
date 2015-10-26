var consts = require('../../shared/constants');
var THREE = require('three.js');
var events = require('./Events');
var world = require('./World');
var keyVR = require('./KeyVR');
var pointerLock = require('./PointerLock');
var scenes = require('./Scenes');
var camera = require('./Camera');

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
var lastRotation = 0;
var floor;

var collidableObjects = [];

var controls = new THREE.PointerLockControls(camera);

var init = function() {
    events.subscribe(consts.events.POINTER_LOCK_CHANGE, function(locked) {
        controls.enabled = locked;
    });

    // If we stick to simple raycasting, collidable objects should contain all objects we want to intersect with using the raycaster
    // for now we just care about the floor -- FIXME hardcoded
    floor = scenes.getScene().getObjectByName('Floor');
    if (floor) {
        collidableObjects.push(floor);
    }

    controls.getObject().position.y = consts.firstPerson.INITIAL_Y;
    scenes.getScene().add(controls.getObject());

    var onKeyEvent = function(event) {
        var keyDown = event.type == consts.browserEvents.KEY_DOWN;

        switch (event.keyCode) {
            case consts.keyboard.UP:
            case consts.keyboard.W:
                move.forward = keyDown;
                break;
            case consts.keyboard.LEFT:
            case consts.keyboard.A:
                move.left = keyDown;
                break;
            case consts.keyboard.DOWN:
            case consts.keyboard.S:
                move.backward = keyDown;
                break;
            case consts.keyboard.RIGHT:
            case consts.keyboard.D:
                move.right = keyDown;
                break;
            case consts.keyboard.SPACE:
                if (keyDown && canJump && (pointerLock.enabled() || keyVR.enabled())) {
                    velocity.y += consts.firstPerson.JUMP_SPEED;

                    // Comment out this line and people can fly :D
                    canJump = false;
                }

                break;
            case consts.keyboard.SHIFT:
                running = keyDown;
                break;
        }
    };

    document.addEventListener(consts.browserEvents.KEY_DOWN, onKeyEvent, false);
    document.addEventListener(consts.browserEvents.KEY_UP, onKeyEvent, false);

    keyVR.onKeyDown(onKeyEvent);
    keyVR.onKeyUp(onKeyEvent);
    keyVR.onMouseMove(controls.move);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

    world.onLoop(animate);
};

var animate = function(time) {
    var restrainPosition = function(obj) {
        if (obj.position.y < consts.firstPerson.LOWEST_Y) {
            velocity.y = 0;
            obj.position.y = consts.firstPerson.LOWEST_Y;
            canJump = true;
        }
    };

    var obj = controls.getObject();
    raycaster.ray.origin.copy(obj.position);
    raycaster.ray.origin.y -= 10;
    var intersections = raycaster.intersectObjects(collidableObjects);
    var isOnObject = intersections.length > 0;
    var delta = time.delta / 1000;
    velocity.x -= velocity.x * consts.firstPerson.DECELERATION * delta;
    velocity.z -= velocity.z * consts.firstPerson.DECELERATION * delta;
    velocity.y -= consts.firstPerson.GRAVITY * consts.firstPerson.PLAYER_MASS * delta;

    var speed = running ? consts.firstPerson.RUNNING_SPEED : consts.firstPerson.WALKING_SPEED;

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

    var position = obj.position.clone();
    position.x = Math.round(position.x * 100) / 100;
    position.y = Math.round(position.y * 100) / 100;
    position.z = Math.round(position.z * 100) / 100;

    var rotation = Math.round(getRotation() * 100) / 100;
    if (!position.equals(lastPosition) || rotation !== lastRotation) {
        events.dispatch(consts.events.PLAYER_MOVED, {position: position, rotation: rotation});
    }

    lastPosition.copy(position);
    lastRotation = rotation;
};

var getPosition = function() {
    return controls.getObject().position;
};

var getRotation = function() {
    return controls.getObject().rotation.y;
};

var getTransform = function() {
    return {
        position: getPosition(),
        rotation: getRotation()
    };
};

world.onInit(init);

module.exports = {
    controls: controls,
    getPosition: getPosition,
    getTransform: getTransform
};
