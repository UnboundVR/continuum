'use strict';

define(['Three', 'Camera', 'PointerLock', 'Tween', 'ItemSelector', 'World', 'KeyVR'], function(THREE, camera, pointerLock, tween, itemSelector, world, keyVR) {
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
            .to({radius: isIntersecting ? 0.12 : 0.03}, 250)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {
                var geometry = new THREE.CircleGeometry(this.radius, 32);
                geometry.vertices.shift();
                mesh.geometry = geometry;
                currentRadius = this.radius;
            }).start();

            currentTween.isIntersecting = isIntersecting;
        }
    };

    var createReticle = function() {
        var defaultRadius = 0.05;

        var geometry = new THREE.CircleGeometry(defaultRadius, 32);
        geometry.vertices.shift();

        var material = new THREE.LineBasicMaterial({
            color: 0x333333
        });

        mesh = new THREE.Line(geometry, material);
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = -10;

        currentRadius = defaultRadius;
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
