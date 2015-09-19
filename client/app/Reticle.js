'use strict';

define(['Three', 'FirstPersonControls', 'PointerLock', 'Tween', 'ItemSelector'], function(THREE, controls, pointerLock, tween, itemSelector) {
    var currentTween;
    var mesh;

    var updateTween = function(isIntersecting) {
        if(currentTween && currentTween.isIntersecting != isIntersecting) {
            currentTween.stop();
        }
        
        if(!currentTween || currentTween.isIntersecting != isIntersecting) {
            currentTween = new tween.Tween({radius: mesh.radius})
            .to({radius: isIntersecting ? 0.15 : 0.05}, 750 )
            .easing(TWEEN.Easing.Sinusoidal.InOut )
            .onUpdate(function () {
                var geometry = new THREE.CircleGeometry(this.radius, 32);
                geometry.vertices.shift();
                mesh.geometry = geometry;
                mesh.radius = this.radius;
            }).start();
            
            currentTween.isIntersecting = isIntersecting;
        }
    };

    var loop = function(time) {
        itemSelector.loop(time);
        
        if (!pointerLock.enabled()) {
			hideReticle();
            return;
        }
		
		showReticle();
        
        if(currentTween) {
            currentTween.update(time);    
        }
        
        updateTween(itemSelector.isIntersecting());
    };

    var createReticle = function() {
        var geometry = new THREE.CircleGeometry(0.05, 16);
        geometry.vertices.shift();
        var material = new THREE.LineBasicMaterial();
        material.color.set(0x000000);

        mesh = new THREE.Line(geometry, material);
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = -10;
        
        mesh.radius = 0.05;

        return mesh;
    };
	
	var hideReticle = function() {
		reticle.visible = false;
	};
	
	var showReticle = function() {
		reticle.visible = true;
	};

    var init = function() {
        itemSelector.init();
        
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
