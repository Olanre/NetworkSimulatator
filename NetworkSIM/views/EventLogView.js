var templateLog="01/02/2014";

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
function populateSimulationLogs(simulationEvents){
	var simulationLogs= document.getElementById("simulation-log");
	simulationLogs.innerHTML="";
	for (event in simulationEvents){
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
function selectSimulationDate(event){
	//should render the current simulation in the simulation thingy
}