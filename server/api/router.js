'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var path = require('path');
var auth = require('./auth');

router.use(bodyParser.json());

var sceneDb = require('../db/scene');

var sendJson = function(res) {
    return function(data) {
        res.json(data);
    };
};

router.get('/scene', function(req, res) {
    res.sendFile(path.resolve('db/scene.json'));
});

router.get('/scene/:uuid', function(req, res, next) {
    // Later we will check here if the user has permission to access that scene
    sceneDb.get(req.params.uuid).then(sendJson(res), next);
});

router.use(auth);

module.exports = router;
