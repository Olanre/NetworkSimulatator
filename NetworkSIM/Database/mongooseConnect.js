var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Working commands
// --> addUser addSim addApp , getSim(name), getUserByToken(token), getApp(name)
//connect to db


var db = mongoose.connect('mongodb://username:password@ds053139.mongolab.com:53139/sc-2');

//attach lister to connected even
mongoose.connection.once('connected', function(){
   console.log("Connected to database")
  });
Schema = db.Schema;

                                    //****Schemas

//mention to me if this needs testing, not sure if we are using it
var event_queue_wrapperSchema = mongoose.Schema({
	eventQueue: [String],
	token: String,
	simulationName: String,
});

var event_queue_wrapper = mongoose.model('event_queue_wrapper', event_queue_wrapperSchema, 'newEvent_queue_wrapper');

                                     //****FUNCTION
									 //SIM FUNCTIONS*****************!
function addSim(aSim)
{
	var LenneteSim = new Sim(aSim);
	LenneteSim.save();
    //console.log("new Simulation " + aSim);
}

//Find simulation by name
function getSimByName(aString, callback)
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
function modifySimByName(aString, aSim)
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

function findAllSimulations(callback)
{
	Sim.find({}, function(err, sims) {
		if(err) callback("No simulations or err ln, 180");
		callback(sims);
	});
}
	//fixed
                      
//ACTIVITY CHANGES

function updateUserAcitivity(aString, aUser, callback)
{ 
	aUser.findOne({activity: activitylist}, function(err, obj)
			{
		      if(err) console.log("User does not have an activity log apparently.");
		      aUser.activitylist = obj.concat(aString);
		                        
		     aUser.save(function (err) {
		    	 if(err) {
		    	 console.error("ERROR, USER NOT UPDATED");
		    	   }
		    	 
		    	callback(); 
		    	 });
			});	
}
	




                        
