var dictFromArray = require('../../shared/dictFromArray');

describe('dictFromArray', function() {
    it('returns empty dictionary from empty array', function() {
        var arr = [];
        var dict = dictFromArray(arr);

        expect(Object.keys(dict).length).toEqual(0);
    });

    it('stores items in dictionary according to key', function() {
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

        expect(dict[key1].value).toEqual(value1);
        expect(dict[key2].value).toEqual(value2);
        expect(Object.keys(dict).length).toEqual(arr.length);
    });
});
