var consts = require('../../shared/constants');
var three = require('three.js');
var camera = require('./Camera');
var pointerLock = require('./PointerLock');
var tween = require('tween.js');
var itemSelector = require('./ItemSelector');
var world = require('./World');
var keyVR = require('./KeyVR');

var currentTween;
var mesh;
var currentRadius;

var init = function() {
    createReticle();

    var reticleContainer = new three.Object3D();
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
        .to({radius: isIntersecting ? consts.reticle.LARGE_RADIUS : consts.reticle.SMALL_RADIUS}, consts.reticle.TWEEN_TIME)
        .easing(tween.Easing.Cubic.InOut)
        .onUpdate(function() {
            var geometry = new three.CircleGeometry(this.radius, consts.reticle.SEGMENTS);
            geometry.vertices.shift();
            mesh.geometry = geometry;
            currentRadius = this.radius;
        }).start();

        currentTween.isIntersecting = isIntersecting;
    }
};

var createReticle = function() {
    var geometry = new three.CircleGeometry(consts.reticle.SMALL_RADIUS, consts.reticle.SEGMENTS);
    geometry.vertices.shift();

    var material = new three.LineBasicMaterial({
        color: consts.reticle.COLOR
    });

    mesh = new three.Line(geometry, material);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = consts.reticle.Z_POSITION;

    currentRadius = consts.reticle.SMALL_RADIUS;
};

var hideReticle = function() {
    mesh.visible = false;
};

var showReticle = function() {
    mesh.visible = true;
};

world.onInit(init);

module.exports = {
    showReticle: showReticle,
    hideReticle: hideReticle
};
