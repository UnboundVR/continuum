var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();

var isAdmin = false;
var presenterMode = false;

var defaultProfileUtilsStub = {
    isAdmin: sinon.stub().returns(false),
    getSetting: sinon.stub().returns(false)
};

var setup = function(profileUtils) {
    return proxyquire('../../server/socket/player-sync/service', {'../../../shared/profileUtils': profileUtils || defaultProfileUtilsStub});
};

test('PlayerSync::register stores name, email and ID', function(t) {
    var playerSync = setup();
    var name = 'target name';
    var email = 'target email';
    var id = 'target ID';
    var profile = {
        name: name,
        email: email
    };

    playerSync.register(id, profile, {}, sinon.stub());

    t.equal(Object.keys(playerSync.players).length, 1, 'players list has one item');
    t.equal(playerSync.players[id].id, id, 'ID is stored');
    t.equal(playerSync.players[id].name, name, 'name is stored');
    t.equal(playerSync.players[id].email, email, 'email is stored');
    t.end();
});

test('PlayerSync::register processes presenter mode if user is admin', function(t) {
    var presenter = {
        isAdmin: sinon.stub().returns(true),
        getSetting: sinon.stub().returns(true)
    };
    var playerSync = setup(presenter);
    var id = 'someId';

    playerSync.register(id, {}, {}, sinon.stub());

    t.equal(playerSync.players[id].presenter, true, 'player is presenter');
    t.end();
});

test('PlayerSync::register processes only one presenter', function(t) {
    var presenter = {
        isAdmin: sinon.stub().returns(true),
        getSetting: sinon.stub().returns(true)
    };
    var playerSync = setup(presenter);
    var id = 'someId';
    var otherId = 'someOtherId';

    playerSync.register(id, {}, {}, sinon.stub());
    playerSync.register(otherId, {}, {}, sinon.stub());

    t.true(playerSync.players[id].presenter, 'player is presenter');
    t.false(playerSync.players[otherId].presenter, 'player is not presenter');
    t.end();
});

test('PlayerSync::register doesnt process presenter mode if user isnt admin', function(t) {
    var fakePresenter = {
        isAdmin: sinon.stub().returns(false),
        getSetting: sinon.stub().returns(true)
    };
    var playerSync = setup(fakePresenter);
    var id = 'someId';

    playerSync.register(id, {}, {}, sinon.stub());

    t.false(playerSync.players[id].presenter, 'player is not presenter');
    t.end();
});

test('PlayerSync::register stores the user in players list by ID', function(t) {
    var playerSync = setup();
    var id = 'someId';

    playerSync.register(id, {}, {}, sinon.stub());

    t.equal(playerSync.players[id].id, id, 'player is stored by id');
    t.end();
});

test('PlayerSync::register broadcasts user info', function(t) {
    var playerSync = setup();
    var profile = {name: 'some name'};
    var broadcast = sinon.spy();
    var id = 'someId';

    playerSync.register(id, profile, {stuff: 'leStuff'}, broadcast);

    t.ok(broadcast.calledOnce, 'broadcast is called once');
    t.ok(broadcast.calledWith(playerSync.players[id]), 'broadcast is called with player info');
    t.end();
});

test('PlayerSync::update does nothing if player does not exist', function(t) {
    var playerSync = setup();
    var broadcast = sinon.spy();
    var id = 'someId';

    playerSync.update(id, {transform: 2}, broadcast);

    t.false(broadcast.called, 'brodcast should not be called');
    t.equal(playerSync[id], undefined, 'no new entry should be created');
    t.end();
});

test('PlayerSync::update stores transform', function(t) {
    var playerSync = setup();
    var id = 'someId';
    playerSync.players[id] = {transform: 1};

    playerSync.update(id, {transform: 2}, sinon.stub());

    t.equal(playerSync.players[id].transform, 2, 'transform is updated');
    t.end();
});

test('PlayerSync::update doesnt change name, id or presenter mode', function(t) {
    var playerSync = setup();
    var id = 'someId';
    playerSync.players[id] = {
        transform: 1,
        name: 'name',
        id: id,
        presenter: false
    };

    var maliciousPayload = {
        transform: 2,
        name: 'other name',
        id: 'other id',
        presenter: true
    };

    playerSync.update(id, maliciousPayload, sinon.stub());

    t.equal(playerSync.players[id].transform, 2, 'transform is updated');
    t.equal(playerSync.players[id].id, id, 'id isnt updated');
    t.equal(playerSync.players[id].name, 'name', 'name isnt updated');
    t.equal(playerSync.players[id].presenter, false, 'presenter isnt updated');
    t.end();
});

test('PlayerSync::update broadcasts updated transform', function(t) {
    var playerSync = setup();
    var id = 'someId';
    playerSync.players[id] = {transform: 1};
    var broadcast = sinon.spy();

    playerSync.update(id, {transform: 2}, broadcast);

    t.equal(broadcast.getCall(0).args[0].transform, 2, 'broadcast is called with updated transform');
    t.equal(broadcast.getCall(0).args[0].id, id, 'broadcast is called with correct id');
    t.end();
});

test('PlayerSync::disconnect broadcasts user ID', function(t) {
    var playerSync = setup();
    var broadcast = sinon.spy();
    var id = 'someId';
    playerSync.players[id] = 'a player';

    playerSync.disconnect(id, broadcast);

    t.ok(broadcast.calledWith(id), 'broadcast is called with ID');
    t.end();
});

test('PlayerSync::disconnect does nothing if player did not exist', function(t) {
    var playerSync = setup();
    var broadcast = sinon.spy();
    var id = 'someId';

    playerSync.disconnect(id, broadcast);

    t.false(broadcast.called, 'broadcast is not called');
    t.end();
});

test('PlayerSync::disconnect deletes player', function(t) {
    var playerSync = setup();
    var id = 'someId';
    playerSync.players[id] = 'some obj';

    playerSync.disconnect(id, sinon.stub());

    t.equal(playerSync.players[id], undefined, 'player with that ID is deleted');
    t.end();
});
