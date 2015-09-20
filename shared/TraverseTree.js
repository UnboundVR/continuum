// Taken from https://github.com/mrdoob/three.js/blob/master/src/core/Object3D.js
var traverse = function (obj, callback) {
    var children = obj.children;

    callback(obj);

    if(children && children.length) {
        children.forEach(function(child) {
            traverse(child, callback);
        });
    }
};

// detect if we're using requirejs, if not export with module.exports :)
if (typeof define === 'function' && define.amd) {
    define([], function () {
        return traverse;
    });
} else if (typeof exports === 'object') {
    module.exports = traverse;
}