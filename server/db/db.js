'use strict';

var couchbase = require('couchbase');
var promise = require('promise');
var extend = require('extend');

var init = function(cluster, bucket, bucketPassword) {    
    this._cluster = new couchbase.Cluster(cluster);
    this._bucket = this._cluster.openBucket(bucket, bucketPassword);
    extend(this, denodeifyObj(this._bucket, 
        ['get', 'counter', 'insert']));
};

var denodeifyObj = function(obj, functions) {
    var res = {};
    
    for(var i = 0; i < functions.length; i++) {
        var func = functions[i];
        res[func] = promise.denodeify(obj[func]).bind(obj);
    }
    
    return res;
};

module.exports = {
    init: init
};