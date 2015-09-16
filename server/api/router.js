'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use('/', bodyParser.json());

var sceneDb = require('./db/scene');

router.get('/scene/:sceneId', function(req, res, next) {
   // TODO call next(error) if there's an error from the scene module (i.e. scene not found!), then create proper middleware for error handling if necessary
   
   var sceneId = req.params.sceneId;
   sceneDb.get(sceneId);
});

module.exports = router;