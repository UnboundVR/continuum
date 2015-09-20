define(['SocketIO', 'QueryString', 'World'], function(io, queryString, world) {
	var socket;
    
    var init = function() {
        socket = io.connect(window.location.origin + '/keyvr');
        
		var onKeyUp = function(event) {
            switch (event.keyCode) {
                case 118:
					launchKeyVR();
					break;
            }
        };

        document.addEventListener('keyup', onKeyUp, false);
		
		parseSearchString();
	};
	
	var launchKeyVR = function() {
		location.href = 'keyvr?scene=<sceneNameHere>';
	};
	
	var parseSearchString = function() {
		if(queryString.keyboardId) {
            syncWithKeyboard(queryString.keyboardId)
        }
	};
	
	var syncWithKeyboard = function(keyboardId) {
		socket.on('keypress', function(data) {
			console.log(data);
			simulateKeyEvent(data.key);
		});
				
		socket.emit('qrCodeScanned', {keyboardId: keyboardId});
	};
	
	var simulateKeyEvent = function(keyCode) {
		// nope
		/*var event = document.createEvent( 'KeyboardEvent' );
		event.initKeyboardEvent( 'keydown', true, false, null, 0, false, 0, false, keyCode, 0 );
		document.dispatchEvent( event );*/
		
		// nope
		/*var e = new KeyboardEvent("keydown", {bubbles : true, cancelable : true, key : "W", char : "W", shiftKey : true});
		document.dispatchEvent(e);*/
		
		// check this? https://gist.github.com/termi/4654819
	};
    
    world.onInit(init);
    return {
		
	};
});
