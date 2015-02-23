var templateLog="01/02/2014";//put some log here for testing

var stateList={};
var timeStampList=[];

/**
 * Updates the title of the page with the name of the simulation
 */
function updatePageTitle(simulationName){
	var title= document.getElementById("page-title");
	title.innerHTML="Event logs for "+simulationName;
}

/**
 * updates the text above the events for a device to view what
 */
function updateDeviceLogTitle(deviceName){
	var deviceTitle=document.getElementById("deviceLog-title");
	deviceTitle.innerHTML="Viewing event log for: "+deviceName;
}
/**
 * adds the dates of each simulation snapshot to the scroll menu
 * to view
 */
function populateDates(dates){
	var logDates = document.getElementById("log-dates");
	logDates.innerHTML="";
	for (date in dates){
		logDates.innerHTML+="<option value="+date+">"+date+"</option>";
	}
}
/**
 * Adds the list of all events that have occurred on this simulation up to this point
 * NOTE: should probably be reverse-chronological order
 */
function populateSimulationLogs(simulationDates){
	var simulationLogs= document.getElementById("simulation-log");
	simulationLogs.innerHTML="";
	for (event in simulationDates){
		simulationLogs.innerHTML+="<option value="+event+">"+event+"</option>";
	}
}
/**
 * Adds the list of all events that have been done by this device on
 * up to the current simulation snapshot.
 */
function populateDeviceLogs(deviceEvents){
	var deviceLogs = document.getElementById("device-log");
	deviceLogs="";
	for (event in deviceEvents){
		deviceLogs.innerHTML+="<option value="+event+">"+event+"</option>";
	}
}
/**
 * function which is called when the user selects a date to view
 * that simulation state from
 */
function selectSimulationDate(selected){
	//should render the current simulation in the simulation thingy
	//look through the passed in list of all the shit, find the 
	//correct date, render the simulation from there.
	console.log(selected);//event should be the time at which this simulation is
	//gets the configMap for that time stamp
	configMap=configMapList[event];
	
}

function updateSimulationEvents(time){
	state=stateList[time];
	state.id.activity_logs
}


//states.id.activity_logs;
//localSession holds the current session and all events that have happened up to this point
function parseStateList(statesObject){
	//list of config maps as key value pairs indexed by dates
	var states= statesObject.states;
	for (var i =0; i<states.length;i++){
		//HERE WE ARE ASSUMING THAT TIMESTAMP IS A STRING
		
		time=states[i].timeStamp; //timestamp for when that state occured
		//configMap=states.id.config_map; //gets the config map for that state
		
		//add the timestamp to the list of timestamps
		timeStampList.push(time);
		
		stateList[time]=states;
	}
}

device.activity

function loadPage(statesObject){
	parseStateList(statesObject);
	populateSimulationLogs(timeStampList);
}