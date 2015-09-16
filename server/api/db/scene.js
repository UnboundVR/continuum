'use strict';

var couchbase = require('couchbase');
var cluster = new couchbase.Cluster('couchbase://127.0.0.1');
var bucket = cluster.openBucket('scenes', '111111');

var get = function(sceneId) {
    bucket.get('scene::' + sceneId, function(err, result) {
    if (err){
        throw err;
    } 

    console.log(result.value);
  });
};

module.exports = {
    get: get
}