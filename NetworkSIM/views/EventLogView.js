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

//should hold a states object I guess 
var availableStatesObject;
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
	
	//get the logs from the states object for that simulation snapshot
	simulationLogs=parseSimulationLogs(availableStatesObject,selected);
	
	//puts the logs for this simulation snapshot into the html
	populateSimulationLogs(simulationLogs);
	
	//sets the gui to be uninteractable and generates the gui
	setInteractable(false);
	generateTopology(configMapList["01/02/2015:12:11:15"],500);
}

function updateSimulationEvents(time){
	state=stateList[time];
	state.simulation.activity_logs;
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
			alert(circleElem.name);
			deriveDeviceEvents(circleElem.name);
		}
	}
}

function deriveDeviceEvents(circleElem){
}




//this should work to parse a states object.
function parseStates(states){
	//iterate through all the states
	for (var i=0; i<states.length; i++){
		//gets all the timestamps from all of these states
		timeStampList.push(states[i].simulation.timestamp);
		//gets all of the config maps for each state
		configMapList.push(states[i].id.configMap);
	}
}

function parseSimulationLogs(states, timeStamp){
	for (var i=0;i<states.length;i++){
		if (states[i].timestamp==timeStamp){
			//this is a string, I'm guessing at how to parse it
			simulationLogs = states[i].activity_logs;
			//split strings
			var logsArray= simulationLogs.split('\n');
			//return array of all logs 
			return logsArray
		}
	}
	//if could not find this simulation
	return "failed";
}

var testState={'id' : 'blahdu3', 
	'state':  [{ 
		'simulation' : {
			'num_devices': '13',
			'num_networks': '6',
			'simulation_name': 'Jeffs sim',
			'id' : 'blahdu3',
			'config_map' : {
		 		'Partition1': {
		 			'networka' : { 'devicea' : '1',  'deviceb@mun.ca': '2', 'devicec@mun.ca':'3'},
		 			'networkb' : { 'deviced': '4', 'devicee': '5'},
		 		},
		  		'Partition2':{ 
		  			'networkc' :{ 'devicef': '6', 'deviceg@mun.ca' : '7',  'deviceh@mun.ca': '8'},
		 			'networkd' :{'devicei@mun.ca':'9', 'device@mun.ca': '10'},
		 			'networkTest' :{},
		 		},
		  		'Partition3':{ 
		  			'networke' : { 'devicek':'11'} 
		  		},
		 		'freelist' : {'devicew': '13', 'evicex' : '14'}
		 	},
			'globalcount': 0,
			'simulation_population': 0,
			'token_list' : { }
		}, 
		'timestamp': '2015-01-012:44:00' 
		'devices' : [
			{ device: 
				'current_device_name': 'devicea',
				'activity': 'moved home \n headed out \n got well'
			},
			{ device: 
				'current_device_name': 'devicea',
				'activity': 'moved home \n headed out \n got well'
			},
			{ device: 
				'current_device_name': 'devicea',
				'activity': 'moved home \n headed out \n got well'
			},
			{ device: 
				'current_device_name': 'devicea',
				'activity': 'moved home \n headed out \n got well'
			},
			{ device: 
				'current_device_name': 'devicea',
				'activity': 'moved home \n headed out \n got well'
			},
			{ device: 
				'current_device_name': 'devicea',
				'activity': 'moved home \n headed out \n got well'
			},
			{ device: 
				'current_device_name': 'devicea',
				'activity': 'moved home \n headed out \n got well'
			},
			{ device: 
				'current_device_name': 'devicea',
				'activity': 'moved home \n headed out \n got well'
			},
		]

{‘simulation’ :  simulation_session, timestamp: ‘2015-02-013:44:00’,
‘devices’: [{ device: device_object},{ device: device_object},{ device: device_object},{ device: device_object}]


{ simulation’ : simulation_session, timestamp: ‘2015-02-022:44:00’ , 
‘devices’: [{ device: device_object},{ device: device_object},{ device: device_object},{ device: device_object}]
} ]
};
