define(['SocketIO'], function(io) {
	var init = function() {
		var self = this;
		
		var onKeyUp = function(event) {
            switch (event.keyCode) {
                case 118:
					showQRCode();
					break;
            }
        };

        document.addEventListener('keyup', onKeyUp, false);
	};
	
	var startKeyVR = function() {
		
	};
	
    return {
		init: init
	};
});
