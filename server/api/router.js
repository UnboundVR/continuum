'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var auth = require('./auth');
var constants = require('../../shared/constants');
var sceneHandler = require('./scene-handler');

router.use(bodyParser.json());

var sendJson = function(res) {
    return function(data) {
        res.json(data);
    };
};

router.get(constants.routes.api.SCENE, function(req, res, next) {
    sceneHandler.getScene().then(sendJson(res), next);
});

router.get(constants.routes.api.SCENE + '/:' + constants.properties.UUID, function(req, res, next) {
    sceneHandler.getScene(req.params[constants.properties.UUID]).then(sendJson(res), next);
});

router.use(auth);

module.exports = router;
