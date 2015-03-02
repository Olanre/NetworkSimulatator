//Needed
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//STATE - storing logs as a string
 var stateSchema = mongoose.Schema({
	id : String,
	state : [StateObject],
});

//State complete
var State = mongoose.model('State', stateSchema, ' newStateSchema');
	
//State building block
var stateObject = mongoose.Schema({
   simulation : String,
   timeStamp : String,
   devices : [User],
});


//state building block complete
var StateObject = mongoose.model('StateObject', stateObject, 'newStateObject');