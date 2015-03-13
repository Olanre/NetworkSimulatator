var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RDT = require("./rdtModel").RDT;

var applicationSchema = mongoose.Schema({

	name : String,
	version : String,
	description : String,
	main : String,
	rdt_list : [{type : mongoose.Schema.Types.ObjectId, ref: 'RDT'}]	
	
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


module.exports = mongoose.model('App', applicationSchema, Apps);