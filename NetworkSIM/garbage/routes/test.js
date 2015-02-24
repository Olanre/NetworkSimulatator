/**
 * New node file
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var server = require('../Server');

router.get('/', function(req, res) {
	
	server.globalCount -= 1;
	res.sendFile("test.html", {"root": path.join(__dirname, '../ajax') });
});

router.post('/', function(req, res) {
	
	server.globalCount += 1;
	res.send(JSON.stringify(server.globalCount));
});

module.exports = router;