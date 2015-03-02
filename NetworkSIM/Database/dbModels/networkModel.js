var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var networkSchema = mongoose.Schema({

      name : String,
      devicearray : [deviceSchema],
	 
});