/**
 * New node file
 */

var express = require('express');
var router = express.Router();

var authToken = require('./Authenticate/authToken');
//var userLogin = require('./Authenticate/UserLogin');

router.use('/authToken', authToken);
//router.use('/userLogin', userLogin);

module.exports = router;
