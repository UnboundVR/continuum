var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

var isAdmin = false;
var ghostMode = false;

var defaultProfileUtilsStub = {
    isAdmin: sinon.stub().returns(false),
    getSetting: sinon.stub().returns(false)
};

var setup = function(profileUtils) {
    return proxyquire('../../server/socket/player-sync/service', {'../../../shared/profileUtils': profileUtils || defaultProfileUtilsStub});
}

test('PlayerSync::register emits back all logged users', function(t) {
    var playerSync = setup();
    playerSync.players['player1ID'] = 'player1';
    playerSync.players['player2ID'] = 'player2';
    var emit = sinon.spy();

    playerSync.register('whatever', {}, {}, sinon.stub(), emit);

    t.equal(emit.callCount, 2, 'emit is called once per player');
    t.ok(emit.calledWith('player1') && emit.calledWith('player2'), 'emit is called with the players data as payload');
    t.end();
});


test('PlayerSync::register stores name and ID', function(t) {
    var playerSync = setup();
    var name = 'target name';
    var id = 'target ID';
    var profile = {name: name};

    playerSync.register(id, profile, {}, sinon.stub(), sinon.stub());

    t.equal(Object.keys(playerSync.players).length, 1, 'players list has one item');
    t.equal(playerSync.players[id].id, id, 'ID is stored');
    t.equal(playerSync.players[id].name, name, 'name is stored');
    t.end();
});

test('PlayerSync::register processes ghost mode if user is admin', function(t) {
    var ghost = {
        isAdmin: sinon.stub().returns(true),
        getSetting: sinon.stub().returns(true)
    };
    var playerSync = setup(ghost);

    playerSync.register('someId', {}, {}, sinon.stub(), sinon.stub());

    t.equal(playerSync.players['someId'].ghost, true, 'player is ghost');
    t.end();
});

test('PlayerSync::register doesnt process ghost mode if user isnt admin', function(t) {
    var fakeGhost = {
        isAdmin: sinon.stub().returns(false),
        getSetting: sinon.stub().returns(true)
    };
    var playerSync = setup(fakeGhost);

    playerSync.register('someId', {}, {}, sinon.stub(), sinon.stub());

    t.notEqual(playerSync.players['someId'].ghost, true, 'player isnt ghost');
    t.end();
});

test('PlayerSync::register stores the user in players list by ID', function(t) {
    var playerSync = setup();

    playerSync.register('someId', {}, {}, sinon.stub(), sinon.stub());

    t.equal(playerSync.players['someId'].id, 'someId', 'player is stored by id');
    t.end();
});

test('PlayerSync::register broadcasts user info', function(t) {
    var playerSync = setup();
    var profile = {name: 'some name'};
    var broadcast = sinon.spy();

    playerSync.register('someId', profile, {stuff: 'leStuff'}, broadcast, sinon.stub());

    t.ok(broadcast.calledOnce, 'broadcast is called once');
    t.ok(broadcast.calledWith, playerSync.players['someId']);
    t.end();
});

test('PlayerSync::update stores position', function(t) {
    var playerSync = setup();
    playerSync.players['someId'] = {position: 1};

    playerSync.update('someId', {position: 2}, sinon.stub());

    t.equal(playerSync.players['someId'].position, 2, 'position is updated');
    t.end();
});

test('PlayerSync::update doesnt change name, id or ghost mode', function(t) {
    var playerSync = setup();
    playerSync.players['someId'] = {
        position: 1,
        name: 'name',
        id: 'someId',
        ghost: false
    };

    var maliciousPayload = {
        position: 2,
        name: 'other name',
        id: 'other id',
        ghost: true
    };

    playerSync.update('someId', maliciousPayload, sinon.stub());

    t.equal(playerSync.players['someId'].position, 2, 'position is updated');
    t.equal(playerSync.players['someId'].id, 'someId', 'id isnt updated');
    t.equal(playerSync.players['someId'].name, 'name', 'name isnt updated');
    t.equal(playerSync.players['someId'].ghost, false, 'ghost isnt updated');
    t.end();
});

test('PlayerSync::update broadcasts updated user info', function(t) {
    var playerSync = setup();
    playerSync.players['someId'] = {position: 1};
    var broadcast = sinon.spy();

    playerSync.update('someId', {position: 2}, broadcast);

    t.ok(broadcast.calledWith(playerSync.players['someId']), 'broadcast is called with updated user info');
    t.end();
});

test('PlayerSync::disconnect broadcasts user ID', function(t) {
    var playerSync = setup();
    var broadcast = sinon.spy();

    playerSync.disconnect('someId', broadcast);

    t.ok(broadcast.calledWith('someId'), 'broadcast is called with ID');
    t.end();
});

test('PlayerSync::disconnect deletes player', function(t) {
    var playerSync = setup();
    playerSync.players['someId'] = 'some obj';

    playerSync.disconnect('someId', sinon.stub());

    t.equal(playerSync.players['someId'], undefined, 'player with that ID is deleted');
    t.end();
});
