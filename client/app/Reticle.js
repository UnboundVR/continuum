

define(['Three', 'Camera', 'PointerLock', 'Tween', 'ItemSelector', 'World', 'KeyVR', 'Constants'], function(THREE, camera, pointerLock, tween, itemSelector, world, keyVR, constants) {
    var currentTween;
    var mesh;
    var currentRadius;

    var init = function() {
        createReticle();

        var reticleContainer = new THREE.Object3D();
        reticleContainer.add(mesh);
        camera.add(reticleContainer);

        world.onLoop(animate);
    };

    var animate = function(time) {
        if (!pointerLock.enabled() && !keyVR.enabled()) {
            hideReticle();
            return;
        }

        showReticle();

        if (currentTween) {
            currentTween.update(time.time);
        }

        updateTween(itemSelector.isIntersecting());
    };

    var updateTween = function(isIntersecting) {
        if (currentTween && currentTween.isIntersecting != isIntersecting) {
            currentTween.stop();
        }

        if (!currentTween || currentTween.isIntersecting != isIntersecting) {
            currentTween = new tween.Tween({radius: currentRadius})
            .to({radius: isIntersecting ? constants.reticle.LARGE_RADIUS : constants.reticle.SMALL_RADIUS}, constants.reticle.TWEEN_TIME)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {
                var geometry = new THREE.CircleGeometry(this.radius, constants.reticle.SEGMENTS);
                geometry.vertices.shift();
                mesh.geometry = geometry;
                currentRadius = this.radius;
            }).start();

            currentTween.isIntersecting = isIntersecting;
        }
    };

    var createReticle = function() {
        var geometry = new THREE.CircleGeometry(constants.reticle.SMALL_RADIUS, constants.reticle.SEGMENTS);
        geometry.vertices.shift();

        var material = new THREE.LineBasicMaterial({
            color: constants.reticle.COLOR
        });

        mesh = new THREE.Line(geometry, material);
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = constants.reticle.Z_POSITION;

        currentRadius = constants.reticle.SMALL_RADIUS;
    };

    var hideReticle = function() {
        mesh.visible = false;
    };

    var showReticle = function() {
        mesh.visible = true;
    };

    world.onInit(init);

    return {
        showReticle: showReticle,
        hideReticle: hideReticle
    };
});
