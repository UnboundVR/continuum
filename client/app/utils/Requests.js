define(['Auth', 'Three'], function(auth, THREE) {
    var remoteLoader = new THREE.XHRLoader();
    var token = auth.getToken();

    if (token) {
        remoteLoader.authorizationHeader = 'bearer ' + token;
    }

    var getJSON = function(url) {
        var promise = new Promise(function(resolve, reject) {
            remoteLoader.load(url, function(text) {
                resolve(JSON.parse(text));
            }, undefined, function(err) {

                reject(err);
            });
        });

        return promise;
    };

    return {
        getJSON: getJSON
    };
});
