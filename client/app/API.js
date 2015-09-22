define(['utils/Requests'], function(req) {
    var baseDir = 'api/';

    var getScene = function(sceneId) {
        var url = baseDir + 'scene';
        if (sceneId) {
            url += '/' + sceneId;
        }

        return req.getJSON(url);
    };

    return {
        getScene: getScene
    };
});
