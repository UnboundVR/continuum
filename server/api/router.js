var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var auth = require('./auth');
var consts = require('../../shared/constants');
var sceneHandler = require('./scene-handler');

router.use(bodyParser.json());

var sendJson = function(res) {
    return function(data) {
        res.json(data);
    };
};

router.get(consts.routes.api.SCENE, function(req, res, next) {
    sceneHandler.getScene().then(sendJson(res), next);
});

router.get(consts.routes.api.SCENE + '/:uuid', function(req, res, next) {
    sceneHandler.getScene(req.params.uuid).then(sendJson(res), next);
});

router.use(auth);

module.exports = router;
