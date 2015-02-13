/**
 * New node file
 */

var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var tokenManager = require('../../simulation/TokenManager.js');

router.get('/', function(req, res) {
	
	var request = new XMLHttpRequest();
	request.open('GET', '/authenticate/authToken');
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	
	var data = '';

	res.on('data', function(chunk) {
	    data += chunk;
	});

	res.on('end',function() {
	    var obj = JSON.parse(data);
	    var token = obj.token;
	    console.log('> created json object');
	    //passes token on to token manager for authentication.
	    var verified = tokenManager.authenticateToken(token);
	});
	
	//console.log();  // for testing
	res.json(JSON.stringify("a value will be placed here"));
});


module.exports = router;