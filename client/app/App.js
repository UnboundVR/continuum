'use strict';

define(['Three', 'Detector', 'Renderer', 'DomContainer', 'Scene', 'loaders/ObjectLoader', 'loaders/GUILoader', 'loaders/ScriptsLoader', 'QueryString', 'World'],
    function(THREE, detector, renderer, container, scene, objectLoader, guiLoader, scriptsLoader, queryString, world) {
        // TODO use same style as other objects
        var App = function() {
            this.load = function(json) {
                scene.setScene(objectLoader.parse(json.scene));
                scene.setCSS3DScene(guiLoader.parse(json));

                // Perhaps we could pass more things -- the most important thing is that later on we document which things we expose to scripts
                // We can also pass other things like renderer directly as params (such as when we pass scene) but I think it's OK to pass just scene as a distinct param
                var relevantApp = {
                    setCamera: renderer.setCamera,
                    play: world.play,
                    stop: world.stop,
                    renderer: renderer.webGL
                };

                scriptsLoader.load(json, relevantApp);
            };

            this.init = function() {
                if (!detector.webgl) {
                    detector.addGetWebGLMessage();
                    return;
                }
    
                var _this = this;

                var remoteLoader = new THREE.XHRLoader();
                
                var sceneId = queryString.sceneId;
                var url = sceneId ? 'api/scene/' + sceneId : 'api/scene';
                
                remoteLoader.load(url, function(text) {
                    _this.load(JSON.parse(text));

                    world.start();
                    
                    container.appendChild(renderer.getDomElement());
                });
            };
        };

        new App().init();
    });
