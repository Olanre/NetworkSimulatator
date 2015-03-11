//requires mongoose
var mongoose = require('mongoose');
//requires schema
var Schema = mongoose.Schema;

//defines the schema

var stateSchema = mongoose.Schema({
	 //type string
	 id : String,
	 state_list : [{simulation : String, timeStamp : Date}],
	 
	});
stateSchema.statics.newState = function (aState)
{
  var LenneteState = new State(aState)
  LenneteState.save();
  //console.log("Saved state" + state);
}

//exporting is done this way, defines, declares Network as the name of this schema/function model. 
module.exports = mongoose.model('State', stateSchema, 'States');