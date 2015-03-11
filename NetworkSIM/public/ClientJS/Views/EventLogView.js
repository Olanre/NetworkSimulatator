
var SimulationMap={};
//should hold a states object I guess 
var current_simulation_history_list;
var stateList={};
var simulationEvents=[];

/**
 *Initiates initial loading of the page, parses the test state and puts up dates
 */ 
function populatePage(simulation_history){
	if(simulation_history!==null){
		timeStampList=parseSimulationHistory(simulation_history);
		//adds the listener to the document
		document.body.onclick = mouseClick;
		populateDates(timeStampList);
	}
	else{
		console.log('populatePage passed a null simulation_history');
	}
}

/**
 *Parses a given simulation_history into timestamps and simulation objects
 * Returns a list of the timestamps for handling
 */
function parseSimulationHistory(simulation_history){
	if(simulation_history!==null&&simulation_history!==''){
		timestampList=[];
		current_simulation_history_list=simulation_history.state;
		//iterate through all of the states
		for (var i=0; i<current_simulation_history_list.length; i++){
			timestamp=current_simulation_history_list[i].timestamp;
			//arranges all simulations by timestamp in a key value pair
			SimulationMap[timestamp]=current_simulation_history_list[i].simulation;
			timestampList.push(timestamp);
		}
		return timestampList;
	}
	else{
		console.log('parseSimulationHistory was passed a null simulation_history');
	}
}

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
	//get the logs from the states object for that simulation snapshot
	simulationLogs=parseSimulationLogs(current_simulation_history_list,selected);
	populateSimulationLogs(simulationLogs);
	setInteractable(false);

	console.log(SimulationMap[selected].partition_list);
	generateTopology(SimulationMap[selected].partition_list,600);
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

		//USE ID
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
	if(circleElem.represents!==null){
		var represents=circleElem.represents;
		var device_log=represents.activity;
	}
}

/**
 *Takes the state object and retrieves the logs for the simulation corresponnding to that particular timestamp
 */ 
function parseSimulationLogs(history_list, timeStamp){
	if(history_list!==null&&history_list!==''&&timeStamp!==null&&timeStamp!==''){
		for (var i=0;i<history_list.length;i++){
			if (history_list[i].timestamp==timeStamp){
				//this is a string, I'm guessing at how to parse it
				simulationLogs = retrieveLogs(history_list[i].simulation);
				//split strings
				var logsArray= simulationLogs.split('\n');
				//return array of all logs 
				return logsArray
			}
		}
		//if could not find this simulation
		return "failed";
	}
	else{
		console.log('parseSimulationLogs was passed null parameters');
	}
}


function retrieveLogs(simulation){
	//calls function from localSimulationManager
	var device_list=getAllDeviceObjects(simulation);
	var simulationLogs='';
	for (var i =0;i<device_list.length;i++){
		simulationLogs+=device_list[i].activity+'\n';
	}
	return simulationLogs;
}