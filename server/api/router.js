'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var path = require('path');
router.use('/', bodyParser.json());

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
   sceneDb.get(req.params.uuid).then(sendJson(res), next);
});

module.exports = router;