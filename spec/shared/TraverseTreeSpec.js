var traverseTree = require('../../shared/TraverseTree');

describe('TraverseTree', function () {
    it('calls the callback once with the object if it has no children', function () {
        var obj = {};
        var spy = jasmine.createSpy('spy');

        traverseTree(obj, spy);

        expect(spy.calls.count()).toEqual(1);
        expect(spy).toHaveBeenCalledWith(obj);
    });
});
