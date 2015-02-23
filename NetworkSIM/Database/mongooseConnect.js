var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Working commands
// --> addUser addSim addApp , getSim(name), getUserByToken(token), getApp(name)



//connect to db
var db = mongoose.connect('mongodb://username:password@ds033601.mongolab.com:33601/sc2');

//attach lister to connected even
mongoose.connection.once('connected', function(){
   console.log("Connected to database")
  });
Schema = db.Schema;
 
                                    //****Schemas

//DEVICE
var deviceSchema = mongoose.Schema({
   device_name : String,
   //deviceNumber : Number,
	
});

//DEVICE COMPLETE
var Device= mongoose.model('Device', deviceSchema, 'newDeviceSchema');

//NETWORK
var networkSchema = mongoose.Schema({
	
 network_name : String,
 network_type : String,
 device_list : [Device]

});

//NETWORK COMPLETE
var Network = mongoose.model('Network', networkSchema, 'newDeviceFormat');

//SIMULATION
var simulationSchema = mongoose.Schema({
	   networkList : [Network],
	   deviceList : [Device],
	   partionList : [Partition],
	   //num_devices: Number,
	   //num_networks: Number,
	   simulation_population: Number,
	   simulation_name: String,
	   config_map: String,
	   tokenMethod : String,
	   globalcount : Number,
	   //token_list : [tokens],
	   activity_logs : String,
	   
	});


	//SIMULATION COMPLETE
	var Sim = mongoose.model('Sim', simulationSchema, 'newSimFormat');

//STATE - storing logs as a string
/** var stateSchema = mongoose.Schema({
	id : String,
	state : [{ id : Sim, 
			  timeStamp : String, 
			  devices : [ {device : User} ] ,
	}]
});

//State complete
var State = mongoose.model('State', stateSchema, ' newStateSchema');

*/
var partitionSchema = mongoose.Schema({
	partition_name: String,
	network_list: [Network]
});



var Partition = mongoose.model('Partition', partitionSchema, 'newSimFormat');
//SIMULATION


//USER 
var userSchema = mongoose.Schema({

	token:String,
	email:String,
	verified: Boolean,
	current_partition: String,
	current_network: String,
	registeredOn: String,
	admin: Boolean,
	networks_created: [],
	application_id:String,
	localcount: Number,
	globalcount: Number,
	current_simulation: String,
	current_device_name: String,
	activity : String,
	});

//STOP DELETTINGINGGEN SHIT                     
var User = mongoose.model('User', userSchema, 'newUserFormat');

						 // objectname, schema, collectionname

var simulation_listSchema = mongoose.Schema({

     name : String,
	 num_devices : Number,
	 num_networks : Number,
});	

                                              
//NEEED
											   
var Simulation_List = mongoose.model('Simulation_List', simulation_listSchema, 'newSim_ListFormat');

var applicationSchema = mongoose.Schema({

	simulation_list : [String],
	super_admin: String,
	total_devices : Number,
	total_networks : Number,
	
	});
//NEEEEEEEEEEEEED
var App = mongoose.model('App', applicationSchema, 'newAppFormat');


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
   var LenneteSim = new Sim();
   LenneteSim = obj;
   //console.log("found Simulation");
   //console.log(LenneteSim);
   callback(LenneteSim);
});		
	
}

//Find simulation by name
function modifySimByName(aString, aSim, callback)
{
 Sim.findOne( {simulation_name: aString}, function(err,obj)
 { 
   if(err) console.log("no sim with name " + aString);
   var LenneteSim = new Sim();
   LenneteSim = obj;
   LenneteSim = aSim;
	LenneteSim.save();
	callback();

});		
	
}

                        //USER FUNCTIONS**************!
function addUser(aUser)
{ 

  var Lennete = new User(aUser);
  Lennete.save();
  //console.log("saved user " + aUser);
}

function modifyUser(aToken, aUser, callback)
{
  User.findOne({token: aToken}, function(err, obj)
  {
  if(err) console.log("No user with that token");
    var example = new User();
	example = obj;
    example = aUser;
	example.save();
	callback();
	//console.log("User with token " + atoken + "edited " + example);	
  });
}
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
	


//FETCH BY TOKEN 
function getUserByToken(aToken, callback)
{
  User.findOne( {token: aToken}, function(err, obj)
  { 
    if(err) console.log("no user with token " + aToken);
	var Lennete = new User();
	Lennete = obj;
	//console.log("found User " );
	callback(Lennete);
  });
}


                               //APP FUNCTIONS
							   
function addApp(anApp)
{
   var LenneteApp = new App(anApp);
   LenneteApp.save();
   //console.log("saved application " + anApp);
}

function getApp(callback)
{
   App.findOne( function(err, obj)
   {
	   var LenetteApp = new App();
	   LenetteApp = obj;
	   callback(LenetteApp);
});
}

function modifyApp(NewApp)
{
   App.findOne( function(err, obj)
   {
     var LenneteApp = new App();
     LenneteAppy = obj;
     LeneteApp = NewApp;
     LeneteApp.save();
     //callback(LenneteApp);
});
}



                        
//STATE FUNCTIONS

function newState(aState)
{
  var LenneteState = new State(aState)
  LenneteState.save();
  //console.log("Saved state" + state);
}

	
//exports, finished calls
module.exports.addUser = addUser;
module.exports.getUserByToken = getUserByToken;
module.exports.addSim = addSim;
module.exports.modifyUser = modifyUser;
module.exports.getSimByName = getSimByName;
module.exports.getApp = getApp;
module.exports.addApp = addApp;
module.exports.modifyApp = modifyApp;
module.exports.modifySimByName = modifySimByName;
