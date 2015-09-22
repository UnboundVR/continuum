/**
 * @author mrdoob / http://mrdoob.com/
 */

// Modified to support calling a move function directly (for KeyVR)
THREE.PointerLockControls = function(camera) {

    var scope = this;

    camera.rotation.set(0, 0, 0);

    var pitchObject = new THREE.Object3D();
    pitchObject.add(camera);

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 10;
    yawObject.add(pitchObject);

    var PI_2 = Math.PI / 2;

    var _this = this;

    this.move = function(movement) {
        yawObject.rotation.y -= movement.x * 0.002;
        pitchObject.rotation.x -= movement.y * 0.002;

        pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
    };

    var onMouseMove = function(event) {

        if (scope.enabled === false) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        _this.move({
            x: movementX,
            y: movementY
        });

    };

    document.addEventListener('mousemove', onMouseMove, false);

    this.enabled = false;

    this.getObject = function() {

        return yawObject;

    };

    this.getDirection = function() {

        // assumes the camera itself is not rotated

        var direction = new THREE.Vector3(0, 0, -1);
        var rotation = new THREE.Euler(0, 0, 0, 'YXZ');

        return function(v) {

            rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);

            v.copy(direction).applyEuler(rotation);

            return v;

        }

    }();

};
