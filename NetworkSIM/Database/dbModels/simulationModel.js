var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var simulationSchema = mongoose.Schema({
	   num_devices: Number,
	   num_networks: Number,
	   simulation_population: Number,
	   simulation_name: String, //unique id of the simulation
	   tokenMethod : String,
	   //partition_list: [Partition],
	   activity_logs : String,	   
});

//Static Functions

simulationSchema.statics.addSim = function (aSim)
{
	var LenneteSim = new Sim(aSim);
	LenneteSim.save();
    //console.log("new Simulation " + aSim);
}

//Find simulation by name
simulationSchema.statics.getSimByName = function (aString, callback)
{
 Sim.findOne( {simulation_name: aString}, function(err,obj)
 { 
   if(err) console.log("no sim with name " + aString);
   
   callback(obj);
   //console.log("found Simulation");
   //console.log(LenneteSim);   
  });			
}

//Modify simulation by name
simulationSchema.statics.modifySimByName = function (aString, aSim)
{
 Sim.findOne( {simulation_name: aString}, function(err,obj)
 { 
   if(err) console.log("no sim with name " + aString);
   var LenneteSim = new Sim();
   LenneteSim = obj;
   LenneteSim = aSim;
	LenneteSim.save();
	//callback();
  });		
}

simulationSchema.statics.findAllSimulations = function (callback)
{
	Sim.find({}, function(err, sims) {
		if(err) callback("No simulations or err ln, 180");
		callback(sims);
	});
}

module.exports = mongoose.model('Sim', simulationSchema, 'Simulations');