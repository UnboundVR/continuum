var test = require('tape');
var sinon = require('sinon');
var CallbackList = require('../../shared/CallbackList');

test('CallbackList does nothing if execute is called before pushing callbacks', function(t) {
    t.plan(1);
    var cl = new CallbackList();

    t.doesNotThrow(cl.execute);
});

test('CallbackList executes callbacks with the payload passed', function(t) {
    var payload = 'payload';
    var callback1 = sinon.spy();
    var callback2 = sinon.spy();
    var cl = new CallbackList();
    cl.push(callback1);
    cl.push(callback2);

    cl.execute(payload);

    t.ok(callback1.calledOnce, 'first callback is called once');
    t.ok(callback1.calledWith(payload), 'first callback is called with payload');
    t.ok(callback2.calledOnce, 'second callback is called once');
    t.ok(callback2.calledWith(payload), 'second clalback is called with payload');
    t.end();
});
