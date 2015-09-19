'use strict';

define([], function() {
    
    var getToken = function() {
        return localStorage.getItem('id_token');
    };
    
    var getHeaders = function() {
        var token = getToken();
        if(token) {
            return {
                'Authorization': 'bearer ' + token
            };
        }
    };
    
    var getJson = function(url) {
        return fetch(url, {
            method: 'get',
            headers: getHeaders()
        }).then(function(response) {
            return response.json();
        });
    };
    
    return {
        getToken: getToken,
        getJson: getJson
    };
});
