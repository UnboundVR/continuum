'use strict';

define(['Three', 'Scene', 'FirstPersonControls', 'Tween'], function(THREE, scene, controls, tween) {
    var mouse = new THREE.Vector2();
    var isIntersecting = false;
    var lastIntersected = null;
    
    // TODO take this from a serious place (e.g. excluded objects could have a flag in scene.json?)
    var excludedObjects = ['Floor', 'Skybox'];

    // Based on the example in http://threejs.org/docs/#Reference/Core/Raycaster
    var onMouseMove = function(event) {
        mouse.x = (event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight ) * 2 + 1;		
    };
    
    var onIntersect = function(obj) {
        lastIntersected = obj;
        console.log(obj.name);
    };
    
    var onStopIntersect = function(obj) {
        console.log('No longer intersecting ' + obj.name);
    }
    
    var loop = function() {
        /* This would use the mouse position, not the reticle position. Might be useful in the future (e.g. for KeyVR)
        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(controls.camera);
        var raycaster = new THREE.Raycaster(controls.getPosition(), vector.sub(controls.getPosition()).normalize());
        */
        
        if(!controls.mouseLocked()) {
            return;
        }
        
        // FIXME This magic vector was taken from https://github.com/neuman/vreticle
        // It probably represents the position of the reticle.
        var vector = new THREE.Vector3(-0.0012499999999999734, -0.0053859964093356805, 0.5);
        vector.unproject(controls.camera);
        var raycaster = new THREE.Raycaster(controls.getPosition(), vector.sub(controls.getPosition()).normalize());
        
        var intersects = raycaster.intersectObjects(scene.getScene().children);
        isIntersecting = false;
        if(intersects.length) {
            var obj = intersects[0].object;
            if(!excludedObjects.some(function(exc) {
                return exc == obj.name;
            })) {
                if(lastIntersected != null && lastIntersected != obj) {
                    onStopIntersect(lastIntersected);
                }
                
                onIntersect(obj);
                lastIntersected = obj;
                isIntersecting = true;
            }
        }
        
        if(!isIntersecting) {
            if(lastIntersected != null) {
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
    
    var init = function() {
        window.addEventListener('mousemove', onMouseMove, false);
        
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