// Init Node.JS and listen to mobile device connection
var socket = io.connect(window.location.origin + '/keyvr', {
    query: 'token=' + localStorage.getItem('id_token')
});

// As soon as we connect to node, we get assigned an ID
socket.on('connect', function() {
	hookQRButton(this.id);
});

// After we have an ID, we can enable the "Generate QR" button, since the QR is generated based on this ID
function hookQRButton(keyboardId) {
	$(function() {
		$('#dasButton').attr('disabled', null);
         
        $('#dasForm').submit(function(e) {
            e.preventDefault();
            
            var customAddress = $('#customAddress').val();
            var payload = (customAddress || window.location.origin) + '/world?keyboardId=' + keyboardId;
			
            $('#qrCode').qrcode(payload);
            $('#localLink').attr('href', payload);
			
            showScreen('linkDevice');
		});
	});
}

// When a device scans the QR code, we hook the keypress events so we start sending socket.io messages whenever a key is pressed
socket.on('deviceConnected', function(data) {
	$('body').keydown(function(e) {
		socket.emit('keydown', {
            ts : new Date(), 
            key : e.which, 
            deviceId : data.deviceId
        });
	});

	$('body').keyup(function(e) {
		socket.emit('keyup', {
            ts : new Date(), 
            key : e.which, 
            deviceId : data.deviceId
        });
	});
    
    $(document).mousemove(function(e) {
        socket.emit('mousemove', {
            ts : new Date(), 
            movement : {
                x: event.movementX || event.mozMovementX || event.webkitMovementX || 0, 
                y: event.movementY || event.mozMovementY || event.webkitMovementY || 0
            }, 
            deviceId : data.deviceId
        });
    });
	
	showScreen('deviceLinked');
    
    
});

// Simple function to display a div and hide others
function showScreen(screen) {
	$('.displaying').addClass('notDisplaying').removeClass('displaying');
	$('#' + screen).removeClass('notDisplaying').addClass('displaying');
}