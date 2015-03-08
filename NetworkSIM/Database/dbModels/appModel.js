var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = mongoose.Schema({

	simulation_list : [String],
	super_admin: String,
	total_devices : Number,
	total_networks : Number,
	
	});

applicationSchema.statics.addApp = function (anApp)
{
   var LenneteApp = new App(anApp);
   LenneteApp.save();
   //console.log("saved application " + anApp);
}

applicationSchema.statics.getApp = function (callback)
{
   App.findOne( function(err, obj)
   {
	   callback(obj);
   });
}



applicationSchema.statics.modifyApp = function (NewApp)
{
   App.findOne( function(err, obj)
   {
     obj = NewApp;
     obj.save();
     
     //callback(LenneteApp);
   });
}


module.exports = mongoose.model('App', aaplicationSchema, Apps);