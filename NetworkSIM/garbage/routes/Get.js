/**
 * New node file
 */

var express = require('express');
var router = express.Router();

var Sync = require('./Get/Sync');

router.use('/Sync', Sync);


module.exports = router;