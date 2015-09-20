// Init Node.JS and listen to mobile device connection
var socket = io.connect(window.location.origin + '/keyvr');

// As soon as we connect to node, we get assigned an ID
socket.on('connect', function() {
	hookQRButton(this.id);
	
	console.log(this.id);
});

// After we have an ID, we can enable the "Generate QR" button, since the QR is generated based on this ID
function hookQRButton(keyboardId) {
	$(function() {
		$('#dasButton').attr('disabled', null).click(function() {
			$('#qrCode').qrcode(keyboardId);		
			showScreen('linkDevice');
		});
	});
} 

// TODO we should probably send both key down and key up

// When a device scans the QR code, we hook the keypress events so we start sending socket.io messages whenever a key is pressed
socket.on('deviceConnected', function(data) {
	$('body').keypress(function(e) {
		onKeyPressed(e.which, new Date(), data.deviceId);
	});
	
	showScreen('deviceLinked');
}); 

// Whenever a key is pressed, a message is sent containing both the key and the current timestamp
function onKeyPressed(key, timestamp, deviceId) {
   var data = {'ts' : timestamp, 'key' : key, 'deviceId' : deviceId};
   socket.emit('keypress', data);
}

// Simple function to display a div and hide others
function showScreen(screen) {
	$('.displaying').addClass('notDisplaying').removeClass('displaying');
	$('#' + screen).removeClass('notDisplaying').addClass('displaying');
}