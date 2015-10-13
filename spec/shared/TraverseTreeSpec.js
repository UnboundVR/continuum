var traverseTree = require('../../shared/TraverseTree');

describe('TraverseTree', function () {
    it('calls the callback once with the object if it has no children', function () {
        var obj = {};
        var spy = jasmine.createSpy('spy');

        traverseTree(obj, spy);

        expect(spy.calls.count()).toEqual(1);
        expect(spy).toHaveBeenCalledWith(obj);
    });

    it('recursively visits all children', function() {
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

        expect(traversedList).toContain(obj);
        expect(traversedList).toContain(obj2);
        expect(traversedList).toContain('some string');
        expect(traversedList).toContain(1);
        expect(traversedList).toContain(2);
        expect(traversedList).toContain(3);
    });

    it('keeps iterating an objects children even if the callback modifies the children property', function() {
        var list = [1,2,3];

        var obj = {
            children: list
        };

        var traversedList = [];

        traverseTree(obj, function(item) {
            if(item !== obj) {
                traversedList.push(item);
            }
            delete obj.children;
        });

        expect(traversedList).toContain(1);
        expect(traversedList).toContain(2);
        expect(traversedList).toContain(3);
    })
});
