'use strict';

define(['Three', 'Detector', 'Renderer', 'DomContainer', 'Scene', 'loaders/ObjectLoader', 'loaders/GUILoader', 'loaders/ScriptsLoader', 'utils/QueryString', 'World', 'API', 'Auth'],
    function(THREE, detector, renderer, container, scene, objectLoader, guiLoader, scriptsLoader, queryString, world, api, auth) {
        var load = function(json) {
            objectLoader.parse(json.scene, function(object) {
                scene.setScene(object);
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

                world.start();

                container.appendChild(renderer.getDomElement());

                loadRoom();
            });
        };

        if (!detector.webgl) {
            detector.addGetWebGLMessage();
            return;
        }

        var loadRoom = function() {
            var request = new XMLHttpRequest();
            request.open('GET', 'http://metavrse.io/public/continuumroom.scene-json/continuumroom.json', true);

            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    var obj = JSON.parse(request.responseText);
                    var threeObj = objectLoader.parse(obj, function(parsed) {
                        scene.getScene().add(parsed);
                    });
                } else {
                    console.log('Boom');
                }
            };

            request.onerror = function() {
                // There was a connection error of some sort
            };

            request.send();
        }

        var sceneId = queryString.sceneId;

        auth.processIdToken().then(function() {
            api.getScene(sceneId).then(function(json) {
                load(json);
            });
        });
    });
