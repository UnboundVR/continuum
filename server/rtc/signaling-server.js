'use strict';

var init = function(io) {
    var listOfUsers = {};
    var shiftedModerationControls = {};

    io.sockets.on('connection', function(socket) {
        var params = socket.handshake.query;
        var socketMessageEvent = params.msgEvent || 'RTCMultiConnection-Message';

        socket.userid = params.userid;

        listOfUsers[socket.userid] = {
            socket: socket,
            connectedWith: {},
            isPublic: false,
            extra: {}
        };

        socket.on('become-a-public-user', function() {
            if (!listOfUsers[socket.userid]) return;
            listOfUsers[socket.userid].isPublic = true;
        });

        socket.on('extra-data-updated', function(extra) {
            if (!listOfUsers[socket.userid]) return;
            listOfUsers[socket.userid].extra = extra;

            for (var user in listOfUsers[socket.userid].connectedWith) {
                listOfUsers[user].socket.emit('extra-data-updated', socket.userid, extra);
            }
        });

        socket.on('changed-uuid', function(uuid) {
            if (listOfUsers[socket.userid]) {
                var oldUserId = socket.userid;
                listOfUsers[uuid] = listOfUsers[oldUserId];
                listOfUsers[uuid].socket.userid = socket.userid = uuid;
                delete listOfUsers[oldUserId];
                return;
            }

            socket.userid = uuid;
            listOfUsers[socket.userid] = {
                socket: socket,
                connectedWith: {},
                isPublic: false,
                extra: {}
            };
        });

        socket.on('set-password', function(password) {
            listOfUsers[socket.userid].password = password;
        });

        socket.on('disconnect-with', function(remoteUserId) {
            if (listOfUsers[socket.userid].connectedWith[remoteUserId]) {
                delete listOfUsers[socket.userid].connectedWith[remoteUserId];
                socket.emit('user-disconnected', remoteUserId);
            }

            if (!listOfUsers[remoteUserId]) return;

            if (listOfUsers[remoteUserId].connectedWith[socket.userid]) {
                delete listOfUsers[remoteUserId].connectedWith[socket.userid];
                listOfUsers[remoteUserId].socket.emit('user-disconnected', socket.userid);
            }
        });

        function onMessageCallback(message) {
            if (!listOfUsers[message.sender]) {
                console.log('user-not-exists', message.sender);
                return;
            }

            if (!listOfUsers[message.sender].connectedWith[message.remoteUserId] && !!listOfUsers[message.remoteUserId]) {
                listOfUsers[message.sender].connectedWith[message.remoteUserId] = listOfUsers[message.remoteUserId].socket;
                listOfUsers[message.sender].socket.emit('user-connected', message.remoteUserId);

                if (!listOfUsers[message.remoteUserId]) {
                    listOfUsers[message.remoteUserId] = {
                        socket: listOfUsers[message.remoteUserId].socket,
                        connectedWith: {},
                        isPublic: false,
                        extra: {}
                    };
                }

                listOfUsers[message.remoteUserId].connectedWith[message.sender] = socket;
                listOfUsers[message.remoteUserId].socket.emit('user-connected', message.sender);
            }

            if (listOfUsers[message.sender].connectedWith[message.remoteUserId] && listOfUsers[socket.userid]) {
                message.extra = listOfUsers[socket.userid].extra;
                listOfUsers[message.sender].connectedWith[message.remoteUserId].emit(socketMessageEvent, message);
            }
        }

        var numberOfPasswordTries = 0;
        socket.on(socketMessageEvent, function(message, callback) {
            if (message.remoteUserId && message.remoteUserId != 'system' && message.message.newParticipationRequest) {
                if (listOfUsers[message.remoteUserId] && listOfUsers[message.remoteUserId].password) {
                    if (numberOfPasswordTries > 3) {
                        socket.emit('password-max-tries-over', message.remoteUserId);
                        return;
                    }

                    if (!message.password) {
                        numberOfPasswordTries++;
                        socket.emit('join-with-password', message.remoteUserId);
                        return;
                    }

                    if (message.password != listOfUsers[message.remoteUserId].password) {
                        numberOfPasswordTries++;
                        socket.emit('invalid-password', message.remoteUserId, message.password);
                        return;
                    }
                }
            }

            if (message.message.shiftedModerationControl) {
                if (!message.message.firedOnLeave) {
                    onMessageCallback(message);
                    return;
                }
                shiftedModerationControls[message.sender] = message;
                return;
            }

            if (message.remoteUserId == 'system') {
                if (message.message.detectPresence) {
                    callback(!!listOfUsers[message.message.userid], message.message.userid);
                    return;
                }

                if (message.message.getPublicUsers) {
                    var allPublicUsers = [];
                    for (var user in listOfUsers) {
                        if (listOfUsers[user].isPublic) {
                            allPublicUsers.push(user);
                        }
                    }
                    callback(allPublicUsers);
                    return;
                }
            }

            if (!listOfUsers[message.sender]) {
                listOfUsers[message.sender] = {
                    socket: socket,
                    connectedWith: {},
                    isPublic: false,
                    extra: {}
                };
            }

            onMessageCallback(message);

            // if someone tries to join a person who is absent
            if (!listOfUsers[message.sender].connectedWith[message.remoteUserId] && message.message.newParticipationRequest) {
                var waitFor = 120; // 2 minutes
                var invokedTimes = 0;
                (function repeater() {
                    invokedTimes++;
                    if (invokedTimes > waitFor) {
                        socket.emit('user-not-found', message.remoteUserId);
                        return;
                    }

                    if (!!listOfUsers[message.remoteUserId]) {
                        onMessageCallback(message);
                    } else setTimeout(repeater, 1000);
                })();
            }
        });

        socket.on('change-userid', function(obj) {
            if (!listOfUsers[obj.oldUserId]) return;

            listOfUsers[obj.newUserId] = listOfUsers[obj.oldUserId];
            delete listOfUsers[obj.oldUserId];
            listOfUsers[obj.newUserId].socket.userid = obj.newUserId;
            socket.userid = obj.newUserId;
        });

        socket.on('disconnect', function() {
            var message = shiftedModerationControls[socket.userid];

            // inform all connected users
            if (listOfUsers[socket.userid]) {
                for (var s in listOfUsers[socket.userid].connectedWith) {
                    listOfUsers[socket.userid].connectedWith[s].emit('user-disconnected', socket.userid);

                    if (listOfUsers[s] && listOfUsers[s].connectedWith[socket.userid]) {
                        delete listOfUsers[s].connectedWith[socket.userid];
                        listOfUsers[s].socket.emit('user-disconnected', socket.userid);
                    }
                }
            }

            if (message) {
                onMessageCallback(message);
                delete shiftedModerationControls[message.userid];
            }

            delete listOfUsers[socket.userid];
        });
    });
};

module.exports = {
    init: init
};