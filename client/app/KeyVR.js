define(['SocketIO', 'QueryString', 'World', 'Auth', 'utils/CallbackList'], function(io, queryString, world, auth, CallbackList) {
    var socket;

    var keyDownCallbacks = new CallbackList();
    var keyUpCallbacks = new CallbackList();
    var mouseMoveCallbacks = new CallbackList();
    var mouseDownCallbacks = new CallbackList();
    var mouseUpCallbacks = new CallbackList();

    var init = function() {
        socket = io.connect(window.location.origin + '/keyvr', {
            query: 'token=' + auth.getToken()
        });

        if (queryString.keyboardId) {
            syncWithKeyboard(queryString.keyboardId)
        }
    };

    var syncWithKeyboard = function(keyboardId) {
        socket.on('keydown', function(data) {
            keyDownCallbacks.execute({keyCode: data.key});
        });

        socket.on('keyup', function(data) {
            keyUpCallbacks.execute({keyCode: data.key});
        });

        socket.on('mousemove', function(data) {
            mouseMoveCallbacks.execute(data.movement);
        });

        socket.on('mousedown', function(data) {
            mouseDownCallbacks.execute({button: data.button});
        });

        socket.on('mouseup', function(data) {
            mouseUpCallbacks.execute({button: data.button});
        });

        socket.emit('qrCodeScanned', {keyboardId: keyboardId});
    };

    world.onInit(init);

    return {
        onKeyDown: keyDownCallbacks.push,
        onKeyUp: keyUpCallbacks.push,
        onMouseMove: mouseMoveCallbacks.push,
        onMouseDown: mouseDownCallbacks.push,
        onMouseUp: mouseUpCallbacks.push
    };
});
