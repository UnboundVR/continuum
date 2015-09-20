'use strict';

define(['Three', 'FirstPersonControls', 'PointerLock', 'Tween', 'ItemSelector', 'Loop'], function(THREE, controls, pointerLock, tween, itemSelector, loop) {
    var currentTween;
    var mesh;
    var currentRadius;
    
    var init = function() {
        createReticle();
        
        var reticleContainer = new THREE.Object3D();
        reticleContainer.add(mesh);
        controls.camera.add(reticleContainer);
        
        loop.onLoop(animate);
    };
    
    var animate = function(time) {
        if (!pointerLock.enabled()) {
			hideReticle();
            return;
        }
		
		showReticle();
        
        if(currentTween) {
            currentTween.update(time.time);    
        }
        
        updateTween(itemSelector.isIntersecting());
    };

    var updateTween = function(isIntersecting) {
        if(currentTween && currentTween.isIntersecting != isIntersecting) {
            currentTween.stop();
        }
        
        if(!currentTween || currentTween.isIntersecting != isIntersecting) {
            currentTween = new tween.Tween({radius: currentRadius})
            .to({radius: isIntersecting ? 0.15 : 0.05}, 750 )
            .easing(TWEEN.Easing.Sinusoidal.InOut )
            .onUpdate(function () {
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
        
        var material = new THREE.LineBasicMaterial();
        material.color.set(0x000000);

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

    return {
        init: init
    };
});
