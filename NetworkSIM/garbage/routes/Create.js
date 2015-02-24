/**
 * New node file
 */

var express = require('express');
var router = express.Router();

var Network = require('./Create/Network');
var Simulation = require('./Create/Simulation');

router.use('/Network', Network);
router.use('/Simulation', Simulation);

module.exports = router;