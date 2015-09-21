define(['SocketIO', 'QueryString', 'World', 'Auth', 'utils/CallbackList'], function(io, queryString, world, auth, CallbackList) {
	var socket;

    var keyDownCallbacks = new CallbackList();
    var keyUpCallbacks = new CallbackList();
    
    var init = function() {
        socket = io.connect(window.location.origin + '/keyvr', {
            query: 'token=' + auth.getToken()
        });
		
		if(queryString.keyboardId) {
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
				
		socket.emit('qrCodeScanned', {keyboardId: keyboardId});
	};

    world.onInit(init);

    return {
		onKeyDown: keyDownCallbacks.push,
        onKeyUp: keyUpCallbacks.push
	};
});
