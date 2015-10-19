var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

var isAdmin = false;
var ghostMode = false;

var defaultProfileUtilsStub = {
    isAdmin: sinon.stub().returns(false),
    getSetting: sinon.stub().returns(false)
};

test('PlayerSync::register emits back all logged users', function(t) {
    var playerSync = proxyquire('../../server/socket/player-sync/service', {'../../../shared/profileUtils': defaultProfileUtilsStub});
    playerSync.players['player1ID'] = 'player1';
    playerSync.players['player2ID'] = 'player2';
    var emit = sinon.spy();

    playerSync.register('whatever', {}, {}, sinon.stub(), emit);

    t.equals(emit.callCount, 2, 'emit is called once per player');
    t.ok(emit.calledWith('player1') && emit.calledWith('player2'), 'emit is called with the players data as payload');
    t.end();
});

/*
test('PlayerSync::register stores name and ID', function(t) {

});

test('PlayerSync::register processes ghost mode iif user is admin', function(t) {

});

test('PlayerSync::register stores the user in players list by ID', function(t) {

});

test('PlayerSync::register broadcasts user info', function(t) {

});

test('PlayerSync::update stores position', function(t) {

});

test('PlayerSync::update doesnt change name, id or ghost mode', function(t) {

});

test('PlayerSync::update broadcasts user info', function(t) {

});

test('PlayerSync::disconnect broadcasts user ID', function(t) {

});

test('PlayerSync::disconnect deletes player', function(t) {

});
*/
