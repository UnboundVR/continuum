'use strict';

var couchbase = require('couchbase');
var scene = require('./boilerplate.json');

// TODO support password for connecting to a cluster
var cluster = new couchbase.Cluster(process.argv[2]);
var bucket = cluster.openBucket(process.argv[3], process.argv[4]);

// TODO incude scene into bucket

console.log('Database at ' + process.argv[2] + ' populated with boilerplate scene!');
process.exit();

// TODO process.exit() is good, process.exit(1) is bad, use for errors and success