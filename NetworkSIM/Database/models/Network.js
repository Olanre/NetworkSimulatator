//Needed 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Network
var networkSchema = mongoose.Schema({
 network_name : String,
 network_type : String,
 partition : String,
 device_list : [User],
});

//Complete
var Network = mongoose.model('Network', networkSchema, 'newNetworkFormat');
