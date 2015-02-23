window.onload=function(){populatePage()}

//for testing
var configMapList={"01/02/2015:12:11:15" : {
		 'Partition1': 
		 {'networka' :
		 { 'devicea' : '1',  'deviceb@mun.ca': '2', 'devicec@mun.ca':'3'},
		 'networkb' :
		 		{ 'deviced': '4', 'devicee': '5'},
		 				},
		  'Partition2':
		 { 'networkc' :
		 { 'devicef': '6', 'deviceg@mun.ca' : '7',  'deviceh@mun.ca': '8'},
		 'networkd' :
		 		{'devicei@mun.ca':'9', 'device@mun.ca': '10'},
		 		'networkTest':{},
		 				},
		  'Partition3':
		 { 'networke' : { 'devicek':'11'} },
		 'freelist' : {'devicew': '13', 'evicex' : '14'}
		 }};//put some log here for testing

var stateList={};
var timeStampList=["01/02/2015:12:11:15","01/02/2015:11:15:15","01/01/2015:08:35:09"];
var simulationEvents=["Device1 moved to Network wyattsHouse", "Device2 stopped existing", "Device3 went to Emily's house"];


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
	for (var i = 0; i<dates.length; i++){
		logDates.innerHTML+="<option value="+dates[i]+">"+dates[i]+"</option>";
	}
}
/**
 * Adds the list of all events that have occurred on this simulation up to this point
 * NOTE: should probably be reverse-chronological order
 */
function populateSimulationLogs(simulationEvents){
	var simulationLogs= document.getElementById("simulation-log");
	simulationLogs.innerHTML="";
	for (var i =0; i<simulationEvents.length;i++){
		simulationLogs.innerHTML+="<option value="+simulationEvents[i]+">"+simulationEvents[i]+"</option>";
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
	//gets the config map for that time stamp
	configMap=configMapList[selected];
	alert(configMap);
	//this should be taken from the config map or wherever the events 
	//are stored
	populateSimulationLogs(simulationEvents);
	generateTopology(configMapList["01/02/2015:12:11:15"],500);
}

function updateSimulationEvents(time){
	state=stateList[time];
	state.id.activity_logs;
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

function populatePage(){

	//adds the listener to the document
	document.body.onclick = mouseClick;
	
	alert(configMapList["01/02/2015:12:11:15"]);
	updatePageTitle("Simulation 1");
	populateDates(timeStampList);
}


function mouseClick(e){
	e = e || event;
	if (event.type == 'click'){
		var target = e.target;
	}
	function toString(el) { 
		return el ? (el.id || el.nodeName) : 'null' ;
	}
	if(toString(target) == "circle"){
		circleElem=shapes[target.getAttribute('data-index')];
		if (hasClass(circleElem.element, 'device')){
			alert("WA");
			deriveDeviceEvents(circleElem);
		}
	}
}

function deriveDeviceEvents(circleElem){
}