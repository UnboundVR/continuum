var THREE = require('three.js');
var detector = require('../lib/Detector');
var renderer = require('./Renderer');
var scenes = require('./Scenes');
var guiLoader = require('./gui/Loader');
var scriptsLoader = require('./scripting/Loader');
var queryString = require('./utils/QueryString');
var world = require('./World');
var api = require('./API');
var login = require('./auth/Login');
var consts = require('../../shared/constants');
var loading = require('./Loading');

var load = function(json) {
    var objectLoader = new THREE.ObjectLoader();
    objectLoader.parse(json.scene, function(object) {
        scenes.setScene(object);
        guiLoader.load(json);

        // Perhaps we could pass more things -- the most important thing is that later on we document which things we expose to scripts
        // We can also pass other things like renderer directly as params (such as when we pass scene) but I think it's OK to pass just scene as a distinct param
        var relevantApp = {
            setCamera: renderer.setCamera,
            play: world.play,
            stop: world.stop,
            renderer: renderer.webGL
        };

        scriptsLoader.load(json, relevantApp).then(function() {
            world.start();
            loading.hide();
            document.getElementById(consts.renderer.THREEJS_CONTAINER).appendChild(renderer.getDomElement());
        });
    });
};

var run = function() {
    if (!detector.webgl) {
        detector.addGetWebGLMessage();
        return;
    }

    var sceneId = queryString.sceneId;
    login().then(function() {
        api.getScene(sceneId).then(function(json) {
            load(json);
        });
    });
};

module.exports = {
    run: run
};
