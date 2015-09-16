'use strict';

var couchbase = require('couchbase');
// FIXME this data should go in a config/env file (use dotenv?)
var cluster = new couchbase.Cluster('couchbase://127.0.0.1');
var bucket = cluster.openBucket('metavrse', '111111');
var promise = require('promise');

var get = function(key) {
    var promise = new Promise(function (resolve, reject) {
        bucket.get(key, function (err, res) {
            if (err){
                reject(err);    
            } else {
                resolve(res.value);
            }
        });
    });
    
    return promise;
};

module.exports = {
    get: get
}