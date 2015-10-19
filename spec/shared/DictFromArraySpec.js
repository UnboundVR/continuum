var test = require('tape');
var dictFromArray = require('../../shared/dictFromArray');

test('dictFromArray returns empty dictionary from empty array', function(t) {
    var arr = [];
    var dict = dictFromArray(arr);

    t.equal(Object.keys(dict).length, 0, 'result has no keys');
    t.end();
});

test('dictFromArray stores items in dictionary according to key', function(t) {
    var key1 = 'item1';
    var key2 = 'item2';
    var value1 = 1;
    var value2 = 2;
    var obj1 = {
        key: key1,
        value: value1
    };
    var obj2 = {
        key: key2,
        value: value2
    };
    var arr = [obj1, obj2];

    var dict = dictFromArray(arr, 'key');

    t.equal(dict[key1].value, value1, 'first object in dictionary is correct');
    t.equal(dict[key2].value, value2, 'second object in dictionary is correct');
    t.equal(Object.keys(dict).length, arr.length, 'amount of keys in result is equal to length of array');
    t.end();
});
