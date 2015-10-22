// Update based on this gist: https://gist.github.com/xdumaine/f9158f4b172116565307

var io = require('socket.io-client');

function SocketIoConnection(config) {
    this.connection = io.connect(config.url, config.socketio);
}

SocketIoConnection.prototype.on = function (ev, fn) {
    console.log(ev)
    this.connection.on(ev, fn);
};

SocketIoConnection.prototype.emit = function () {
    this.connection.emit.apply(this.connection, arguments);
};

SocketIoConnection.prototype.getSessionid = function () {
    // Here lies the difference with the 0.9.x version
    return this.connection.io.engine.id;
};

SocketIoConnection.prototype.disconnect = function () {
    return this.connection.disconnect();
};

module.exports = SocketIoConnection;
