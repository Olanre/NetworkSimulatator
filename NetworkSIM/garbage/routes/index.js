var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var server = require('../Server');


router.get('/', function(req, res) {
	
	console.log("> '/' path requested");
	server.globalCount -= 1;
	res.sendFile("AttachToken.html", {"root": path.join(__dirname, '../ajax') });
});

module.exports = router;