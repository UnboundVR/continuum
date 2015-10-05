'use strict';

define(['Three', 'Detector', 'Renderer', 'DomContainer', 'Scenes', 'ObjectLoader', 'gui/Loader', 'scripting/Loader', 'utils/QueryString', 'World', 'API', 'Auth'],
    function(THREE, detector, renderer, container, scene, objectLoader, guiLoader, scriptsLoader, queryString, world, api, auth) {
        var load = function(json) {
            objectLoader.parse(json.scene, function(object) {
                scene.setScene(object);
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
                    container.appendChild(renderer.getDomElement());
                });
            });
        };

        if (!detector.webgl) {
            detector.addGetWebGLMessage();
            return;
        }

        var sceneId = queryString.sceneId;

        auth.processIdToken().then(function() {
            api.getScene(sceneId).then(function(json) {
                load(json);
            });
        });
    });
