'use strict';

var Promise = require('promise');
var fs = require('fs');
var request = require('request');
var path = require('path');
var sceneDb = require('../db/scene');
var traverse = require('../../shared/TraverseTree');

var readFile = Promise.denodeify(fs.readFile);

var getScene = function(uuid) {
    var doGetScene = function(uuid) {
        if (uuid) {
            // Later we will check here if the user has permission to access that scene
            return sceneDb.get(uuid);
        } else {
            return readFile(path.resolve('db/scene.json')).then(function(res) {
                return JSON.parse(res);
            });
        }
    };

    // FIXME remotes are not populated into db yet
    return doGetScene(uuid).then(function(scene) {
        if (!scene.remote || !scene.remote.length) {
            return scene;
        }

        // TODO make actual call to request
        var fetchRemoteScene = function(url) {
            return new Promise(function(resolve, reject) {
                request(url, function(err, res, body) {
                    if (!err && res.statusCode == 200) {
                        resolve(body);
                    } else {
                        reject(err);
                    }
                });
            });
        };

        var promises = [];
        scene.remote.forEach(function(url) {
            promises.push(fetchRemoteScene(url));
        });

        return Promise.all(promises).then(function(results) {
            delete scene.remote;

            // TODO expand remote objects into scene
            // iterate results, merge each one into scene.scene

            results.forEach(function() {
                scene.scene.push()
            });

            return scene;
        });

    });
};

module.exports = {
    getScene: getScene
};
