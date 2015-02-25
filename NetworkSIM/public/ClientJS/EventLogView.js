window.onload=function(){populatePage(testState)}

var configMapList={};
//should hold a states object I guess 
var availableStatesObject;
var stateList={};
var timeStampList=[];
var simulationEvents=["Device1 moved to Network wyattsHouse", "Device2 stopped existing", "Device3 went to Emily's house"];


/**
 * Updates the title of the page with the name of the simulation
 */
function updatePageTitle(timestamp){
	var title= document.getElementById("page-title");
	title.innerHTML="Viewing event logs up to "+timestamp;
}

function updateSimulationLogTitle(timestamp){
	var title = document.getElementById('simulation-log-title');
	title.innerHTML='logs for this simulation at '+timestamp;
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
	deviceLogs.innerHTML="";
	for (var i =0; i<deviceEvents.length;i++){
		deviceLogs.innerHTML+="<option value="+deviceEvents[i]+">"+deviceEvents[i]+"</option>";
	}
}
/**
 * function which is called when the user selects a date to view
 * that simulation state from
 */
function selectSimulationDate(selected){
	updatePageTitle(selected);
	updateSimulationLogTitle(selected);
	//gets the config map for that time stamp
	configMap=configMapList[selected];
	//get the logs from the states object for that simulation snapshot
	simulationLogs=parseSimulationLogs(availableStatesObject,selected);
	populateSimulationLogs(simulationLogs);
	setInteractable(false);
	generateTopology(configMapList[selected],700);
}

/**
 *Initiates initial loading of the page, parses the test state and puts up dates
 */ 
function populatePage(state){
	parseState(state);
	//adds the listener to the document
	document.body.onclick = mouseClick;
	populateDates(timeStampList);
}

/**
 * Handles getting mouse clicks on a device
 */
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
			updateDeviceLogTitle(circleElem.name);
			var events=deriveDeviceEvents(circleElem);
			populateDeviceLogs(events);
		}
	}
}

/**
 * Upon clicking a device, this should derive all of the events that 
 */
function deriveDeviceEvents(circleElem){
	var deviceName=circleElem.name;
	//holds the events for this device
	var deviceEvents='';
	var logDates = document.getElementById("log-dates")
	var timeStamp = logDates.options[logDates.selectedIndex].innerHTML;
	//find the simulation index for this timestamp
	for (var i=0;i<availableStatesObject.length;i++){
		console.log(availableStatesObject[i].timestamp);
		if (availableStatesObject[i].timestamp==timeStamp){
			//find the device this corresponds to
			for (var j=0;j<availableStatesObject[i].devices.length;j++){
				console.log(availableStatesObject[i].devices[j].device.current_device_name);
				if(availableStatesObject[i].devices[j].device.current_device_name==deviceName){
					deviceEvents=availableStatesObject[i].devices[j].device.activity;
				}
			}
		}
	}
	//split the device events into an array
	deviceArray=deviceEvents.split('\n');
	return deviceArray;
}


/**
 *Parses a given state object into config maps and timestamps
 */
function parseState(state){
	var states=state.states;
	availableStatesObject=states;
	//iterate through all the states
	for (var i=0; i<states.length; i++){
		timestamp=states[i].timestamp;
		//gets all the timestamps from all of these states
		timeStampList.push(states[i].timestamp);
		//gets all of the config maps for each state
		console.log(states[i].simulation.config_map);
		configMapList[timestamp]=states[i].simulation.config_map;
	}
}

/**
 *Takes the state object and retrieves the logs for the simulation corresponnding to that particular timestamp
 */ 
function parseSimulationLogs(states, timeStamp){
	for (var i=0;i<states.length;i++){
		console.log(states[i].timestamp +" and original is "+timestamp);
		if (states[i].timestamp==timeStamp){
			//this is a string, I'm guessing at how to parse it
			simulationLogs = states[i].activity_logs;
			console.log(simulationLogs);
			//split strings
			var logsArray= simulationLogs.split('\n');
			//return array of all logs 
			return logsArray
		}
	}
	//if could not find this simulation
	return "failed";
}


// a test states object
var testState={id : 'blahdu3', 
	states:  [{ 
		simulation : {
			num_devices: 14,
			num_networks: 6,
			simulation_name: 'Jeffs sim',
			id : 'blahdu3',
			config_map : {
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
		 	}
		}, 
		timestamp: '2015-01-012:44:00',
		activity_logs: 'devicea: moved home \n devicea: headed out \n devicea: got well \n deviceb@mun.ca: got very hungry \n deviceb@mun.ca: didnt hang out',
		devices : [
			{ device: { 
				current_device_name: 'devicea',
				activity: 'moved home \n headed out \n got well'
				}
			},
			{ device: { 
				current_device_name: 'deviceb@mun.ca',
				activity: 'got very hungry \n didnt hang out'
				}
			},
			{ device: {
				current_device_name: 'devicec@mun.ca',
				activity: 'wwel'
				}
			},
			{ device: {
				current_device_name: 'deviced',
				activity: 'gave out fruit'
				}
			},
			{ device: {
				current_device_name: 'devicee',
				activity: 'NO MORE GAMEs'
				}
			},
			{ device: {
				current_device_name: 'devicef',
				activity: 'g \n o \n t '
				}
			},
			{ device: {
				current_device_name: 'deviceg@mun.ca',
				activity: 'made out'
				}
			},
			{ device: {
				current_device_name: 'deviceh@mun.ca',
				activity: 'working from home'
				}
			},
			{ device: {
				current_device_name: 'devicei@mun.ca',
				activity: 'made a very good lunch'
				}
			},
			{ device: {
				current_device_name: 'device@mun.ca',
				activity: 'donna batten'
				}
			},
			{ device: {
				current_device_name: 'devicek',
				activity: 'i am going aways'
				}
			},
			{ device: {
				current_device_name: 'devicew',
				activity: 'obese'
				}
			},
			{ device: {
				current_device_name: 'evicex',
				activity: 'I am well'
				}
			},
		]
	}]
};

