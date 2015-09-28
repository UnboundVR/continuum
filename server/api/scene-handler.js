'use strict';

var Promise = require('promise');
var fs = require('fs');
var path = require('path');
var sceneDb = require('../db/scene');
var readFile = Promise.denodeify(fs.readFile);

var getScene = function(uuid) {
    if (uuid) {
        // Later we will check here if the user has permission to access that scene
        return sceneDb.get(uuid);
    } else {
        return readFile(path.resolve('db/scene.json')).then(function(res) {
            return JSON.parse(res);
        });
    }
};

module.exports = {
    getScene: getScene
};
