/**
 * New node file
 */

var express = require('express');
var router = express.Router();

var Device = require('./Delete/Device');
var Network = require('./Delete/Network');
var Token = require('./Delete/Token');
var PartitionMap = require('./Delete/PartitionMap');
var Simulation = require('./Delete/Simulation');

router.use('/Device', Device);
router.use('/Network', Network);
router.use('/Token', Token);
router.use('/PartitionMap', PartitionMap);
router.use('/Simulation', Simulation);


module.exports = router;