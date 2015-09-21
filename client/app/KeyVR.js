define(['SocketIO', 'QueryString', 'World', 'Auth', 'utils/ExecuteCallbacks'], function(io, queryString, world, auth, executeCallbacks) {
	var socket;

    var keydownCallbacks = [];
    var keyupCallbacks = [];
    
    var init = function() {
        socket = io.connect(window.location.origin + '/keyvr', {
            query: 'token=' + auth.getToken()
        });
		
		parseSearchString();
	};
	
	var parseSearchString = function() {
		if(queryString.keyboardId) {
            syncWithKeyboard(queryString.keyboardId)
        }
	};
	
	var syncWithKeyboard = function(keyboardId) {
		socket.on('keydown', function(data) {
            executeCallbacks(keydownCallbacks, {keyCode: data.key});
		});

        socket.on('keyup', function(data) {
            executeCallbacks(keyupCallbacks, {keyCode: data.key});
        });
				
		socket.emit('qrCodeScanned', {keyboardId: keyboardId});
	};

    var onKeyDown = function(callback) {
        keydownCallbacks.push(callback);
    };

    var onKeyUp = function(callback) {
        keyupCallbacks.push(callback);
    };
    
    world.onInit(init);

    return {
		onKeyDown: onKeyDown,
        onKeyUp: onKeyUp
	};
});
