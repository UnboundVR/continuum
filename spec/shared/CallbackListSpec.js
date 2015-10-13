var CallbackList = require('../../shared/CallbackList');

describe('CallbackList', function() {
    it('does nothing if execute is called before pushing callbacks', function() {
        var cl = new CallbackList();

        cl.execute();
    });

    it('executes callbacks with the payload passed', function() {
        var payload = 'payload';
        var callback1 = jasmine.createSpy('spy1');
        var callback2 = jasmine.createSpy('spy2');
        var cl = new CallbackList();
        cl.push(callback1);
        cl.push(callback2);

        cl.execute(payload);

        expect(callback1).toHaveBeenCalledWith(payload);
        expect(callback2).toHaveBeenCalledWith(payload);
        expect(callback1.calls.count()).toEqual(1);
        expect(callback2.calls.count()).toEqual(1);
    })
});
