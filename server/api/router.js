'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use('/', bodyParser.json());

var sceneDb = require('./db/scene');

// I need to do this because passing just res.json doesn't work (dunno why)
var sendJson = function(res) {
    return function(data) {
        res.json(data);
    };
}

router.get('/scene/:sceneId', function(req, res, next) {
   sceneDb.get(req.params.sceneId).then(sendJson(res), next);
});

module.exports = router;