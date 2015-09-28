'use strict';

var Promise = require('promise');
var fs = require('fs');
var path = require('path');
var sceneDb = require('../db/scene');

var getScene = function(uuid) {
    if (uuid) {
        // Later we will check here if the user has permission to access that scene
        return sceneDb.get(uuid);
    } else {
        return new Promise(function(resolve, reject) {
            fs.readFile(path.resolve('db/scene.json'), function(err, res) {
                if (err) {
                    reject(err);
                }

                resolve(JSON.parse(res));
            });
        });
    }
};

module.exports = {
    getScene: getScene
};
