var test = require('tape');
var sinon = require('sinon');
var traverseTree = require('../../shared/traverseTree');

var contains = function(arr, item) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
            return true;
        }
    }

    return false;
};

test('traverseTree calls the callback once with the object if it has no children', function(t) {
    var obj = {};
    var spy = sinon.spy();

    traverseTree(obj, spy);

    t.ok(spy.calledOnce, 'callback is called once');
    t.ok(spy.calledWith(obj), 'callback is called with the object');
    t.end();
});

test('traverseTree recursively visits all children', function(t) {
    var obj2 = {
        children: [1,2,3]
    };
    var obj = {
        children: [
            'some string',
            obj2
        ]
    };
    var traversedList = [];

    traverseTree(obj, function(item) {
        traversedList.push(item);
    });

    t.ok(contains(traversedList, obj));
    t.ok(contains(traversedList, obj2));
    t.ok(contains(traversedList, 'some string'));
    t.ok(contains(traversedList, 1));
    t.ok(contains(traversedList, 2));
    t.ok(contains(traversedList, 3));
    t.equals(traversedList.length, 6);
    t.end();
});

test('traverseTree keeps iterating an objects children even if the callback modifies the children property', function(t) {
    var list = [1,2,3];
    var obj = {
        children: list
    };
    var traversedList = [];

    traverseTree(obj, function(item) {
        if (item !== obj) {
            traversedList.push(item);
        }

        delete obj.children;
    });

    t.ok(contains(traversedList, 1));
    t.ok(contains(traversedList, 2));
    t.ok(contains(traversedList, 3));
    t.equals(traversedList.length, 3);
    t.end();
});
