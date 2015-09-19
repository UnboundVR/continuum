'use strict';

define([], function() {
    
    var getToken = function() {
        return localStorage.getItem('id_token');
    };
    
    var getJson = function(url) {
        return fetch('/api/scene', {
            method: 'get',
            headers: {
                'Authorization': 'bearer ' + this.getToken()
            }
        }).then(function(response) {
            return response.json();
        });
    };
    
    return {
        getToken: getToken,
        getJson: getJson
    };
});
