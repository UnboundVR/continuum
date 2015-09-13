define(['SocketIO', 'jquery', 'QRCode'], function(io, $) {
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
	
	var showQRCode = function() {
		$('#threejs-container').detach();
		var qrElement = $('div').attr('id', 'qrCode');
		qrElement.qrcode('hola');
		
		$('body').add(qrElement);
	};
	
    return {
		init: init
	};
});
