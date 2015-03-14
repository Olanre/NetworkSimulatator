//requires mongoose
var mongoose = require('mongoose');
//requires schema
var Schema = mongoose.Schema;

//defines the schema

var stateSchema = mongoose.Schema({
	 //type string
	 simulation_id : String,
	 state : {type : Array , "default" : [] },
	 
	 
	});
stateSchema.statics.newState = function (aState)
{
  var LenneteState = new State(aState)
  LenneteState.save();
  //console.log("Saved state" + state);
}


module.exports = mongoose.model('State', stateSchema, 'States');