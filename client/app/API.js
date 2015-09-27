'use strict';

define(['utils/Requests', 'Constants'], function(req, constants) {
    var baseUrl = constants.routes.api.BASE.substring(1);

    var getScene = function(sceneId) {
        var url = baseUrl + constants.routes.api.SCENE;
        if (sceneId) {
            url += SLASH + sceneId;
        }

        return req.getJSON(url);
    };

    return {
        getScene: getScene
    };
});
