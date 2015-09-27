'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var path = require('path');
var auth = require('./auth');

var constants = require('../../shared/constants');

router.use(bodyParser.json());

var sceneDb = require('../db/scene');

var sendJson = function(res) {
    return function(data) {
        res.json(data);
    };
};

router.get(constants.routes.api.SCENE, function(req, res) {
    res.sendFile(path.resolve('db/scene.json'));
});

router.get(constants.routes.api.SCENE + '/:uuid', function(req, res, next) {
    // Later we will check here if the user has permission to access that scene
    sceneDb.get(req.params.uuid).then(sendJson(res), next);
});

router.use(auth);

module.exports = router;
