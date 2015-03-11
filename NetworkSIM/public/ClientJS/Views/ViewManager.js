/**
 * Renders the start page
 */
window.onload = function(){
	defaultsideBarView();
	loadStyleSheet('../css/bootstrap.min.css');
	loadStyleSheet('../css/dashboard.css');
	//loadStyleSheet('../css/defaultPages.css');
	defaultheaderView();
	updateAllViews();
	syncWithServer();	
}

/**
 * loadAppContent loads the content from a sync to the server
 *
function loadAppContent(){
	syncWithServer();
	updateAllViews(400);
	
}*/


/**
 * updates all of the views 
 */
function updateAllViews( timeout){
	setTimeout(function() {
		simulationListView();
	}, timeout);	
}


/**
 * Shows the user's account information
 */
function AccountView(){
	var local_device = get_local_device();
	var html = AccountTemplate(local_device);
	var content = getContainer();
	content.innerHTML = html;
}

function deviceHeaderView(){
	var local_device = get_local_device();
	var local_session = get_local_simulation();
	var html = viewDeviceTemplate(local_device, local_session);
	var content = getContainer();
	content.innerHTML = html;
}


/**
 * Displays the user's information
 */
function appDefaultView(){
	//clears everything on the page
	clearFooter();
	clearSection();
	
	var local_device = get_local_device();
	//sets the top bar to be the default look
	defaultheaderView();
	if(getVerified() == false){
		alert('You do not have permission to access this. Please get a token first.');
	}else{
		//sets the page to view to 'user information' page
		var app = CounterAppTemplate(local_device);
		var content = getContainer();
		content.innerHTML = app;
		//sets the sidebar to the sidebar for when inside a simulation
		simulationSideBarView();
	}
}

/**
 * sets the sidebar of the page to look as it should when the page is opened
 */
function defaultheaderView(){
	var header = document.getElementById('template6');
	var head= getHeader();
	head.innerHTML = header.innerHTML;
}


/**
 *Gets the view which displays a list of available simulations
 */
function simulationListView(){
	//sets the header view
	defaultheaderView(); 
	//clears everything on the page
	clearNav();
	clearFooter();
	clearSection();

	var simulations = get_local_simulation_list();
	
	
	//adds the list of simulations into the page
	var html =  SimulationDataListTemplate(simulations);
	//gets the container of the page
	var content = getContainer();
	//sets the default sidebar page
	defaultsideBarView();

	content.innerHTML = html;
}

/**
 * newSimulationView changes the view to the page where a simulation may be created
 */
function newSimulationView(){
	var simulation_view = document.getElementById('template10');
	var html = simulation_view.innerHTML;
	var content = getContainer();
	content.innerHTML = html;
}
/**
 * displays a field in which to create a new network in the new simulation page
 */
function createNetworkView(){
	var network_view = document.getElementById('template1');
	var html = network_view.innerHTML;
	var content = getSection();
	content.innerHTML = html;
}

/**
 * displays the sidebar when not within a specific simulation
 */
function defaultsideBarView(){
	var sidebar = document.getElementById('template5');
	var aside = getSideBar();
	html = sidebar.innerHTML;
	aside.innerHTML = html;
}

/**
 * Sets the sidebar to the appropriate sidebar for being within a simulation
 */
function simulationSideBarView(){
	var sidebar = document.getElementById('template9');
	var aside = getSideBar();
	aside.innerHTML = sidebar.innerHTML;
}

/****
 * A view which allows for manipulation of network topology through our GUI
 ****/

function networkTopologyView(){
	//removes previously occuring stylesheets and javascript files if they occured before
	removeFile('topologyView.css', 'css');
	removeFile('Manipulation.js', 'js');
	removeFile('Shapes.js', 'js');
	removeFile('Drawing.js', 'js');

	defaultheaderView(); 
	
	clearNav();
	clearFooter();
	clearSection();

	var content = getContainer();
	//defaultsideBarView();
	loadStyleSheet('../css/topologyView.css');
	loadJSFile('/gui/Manipulation.js');
	loadJSFile('/gui/Shapes.js');
	loadJSFile('/gui/Drawing.js');
	
	var html="<div id='bigDiv'>" +
			"<svg></svg>" +
			"<script src='../gui/interact-1.2.2.js'></script>" +
			"<script src='../gui/Manipulation.js'></script>" +
			"<br><button class='buttton' type='button' onclick = createDeviceGraphic()>New Device</button>" +
					"<button class='buttton'  type='button' onclick = createNetworkGraphic()>New Network</button>" +
							//"<button class='buttton'  type='button' onclick = generateTopology(testConfigMap1,800)>Load Configuration 1</button>" +
									//"<button class='buttton' type='button' onclick = generateTopology(testConfigMap2,800)>Load Configuration 2</button>" +
											//"<button class='buttton' type='button' onclick = generateTopology(testConfigMap3,800)>Load Configuration 3</button>" +
													//"<button class='buttton' type='button' onclick = clearCanvas()>Clear Canvas</button>" +
															"</div>";
	var content = getContainer();
	content.innerHTML = html;
	//generate our topology view from the simulation
	var simulation  = get_local_simulation();
	
	//generateTopology(simulation.partition_list, 800);
}


/***
 * A view which allows you to view the logs for devices and simulations based on a particular timestamp
 */
function eventLogsView(){
	removeFile('topologyView.css', 'css');
	removeFile('EventLogView.css', 'css');
	removeFile('EventLogView.js', 'js');
	removeFile('Manipulation.js', 'js');
	removeFile('Shapes.js', 'js');
	removeFile('Drawing.js', 'js');

	//clearNav();
	clearFooter();
	clearSection();

	defaultheaderView();

	var content = getContainer();
	//defaultsideBarView();
	
	loadStyleSheet('../css/topologyView.css');
	loadStyleSheet('../css/EventLogView.css');
	loadJSFile('../view/EventLogView.js');
	loadJSFile('../gui/Manipulation.js');
	loadJSFile('../gui/Shapes.js');
	loadJSFile('../gui/Drawing.js');
	
	var html =
	"<div id='title-bar'>"+
		"<h1 id ='page-title'>Event Logs View</h1>"+
	"</div>"+
		"<div class = 'row'>"+
			"<div class='cell'>"+
				"<svg>"+
				"</svg>"+
			"</div>"+
			"<div class = 'cell'>"+
				"<select size = '10' id ='log-dates' onchange='selectSimulationDate(this.value)'>"+
				"</select>"+
			"</div>"+
		"</div>"+
		"<div class = 'row'>"+
			"<div class= 'cell'>"+
				"<h3 id='deviceLog-title'>Select a device in the GUI to view its logs</h3>"+
				"<select size = '10' id ='device-log'>"+
				"</select>"+
			"</div>"+
			"<div class='cell'>"+
				"<h3 id='simulation-log-title'>Simulation logs</h3>"+
				"<select size = '10' id ='simulation-log'>"+
				"</select>"+
			"</div>"+
		"</div>"
	var content = getContainer();
	content.innerHTML = html;
}

/**
 * Display's the token registration page
 */
function RegisterView(id){
	var obj = { 'id' : id};
	var html = SimulationRegistrationTemplate(obj);
	var content = getContainer();
	
	content.innerHTML = html;
	document.getElementById('simulation_id_div').value = id;
}

function SimulationManagementView(){
	networkTopologyView();
	SimulationManagementSideBarView();
	
}


function SimulationManagementSideBarView(){
	var sidebar = document.getElementById('template18');
	var aside = getSideBar();
	aside.innerHTML = sidebar.innerHTML;
}
/**
 * Displays the list of all networks not sure if necessary
 */
function NetworksListView(){
	var local_device = get_local_device();
	var lists = getAllNetworkObjects();
	var html = NetworksListTemplate(lists, local_device);
	
	getSection().innerHTML = html;
}

/**
 * Displays the list of all devices
 */
function DeviceListView(){
	var devices = getAllDeviceObjects();
	var html = "<div class = 'container'> " +
	"<table>";
	html += DevicesListTemplate(devices);
	html += "</table>" +
	"</div><br>";
	getSection().innerHTML = html;
}

/**
 * changes the page view to the logs of this user.
 */
function LogsView(){
	var logs = getLocalSimulationLogs();
	var html = SimulationLogsTemplate(logs);
	var footer = getFooter();
	footer.innerHTML = html;
}

/** Function to get all the partition input fields in the document
 * referencing the fields by class name and returning the DOM list
 * @return partiton_elements, the DOM list of input fields.
 */
function getAllPartitionsInputField(){
	var config_map = document.getElementById('config-map');
	var partition_elements = config_map.getElementsByClassName('partition');
	return partition_elements;
}

/** Function to get all the network input fields in the document
 * referencing the fields by class name and returning the DOM list
 * @return network_elements, the DOM list of input fields.
 */
function getAllNetworksInputField(partition){
	var network_elements = partition.getElementsByClassName('network');
	return network_elements;
}

/** Function to get all the device input fields in the document
 * referencing the fields by class name and returning the DOM list
 * @return device_elements, the DOM list of input fields.
 */
function getAllDevicesInputField(network){
	var device_elements = network.getElementsByClassName('device');
	return device_elements;
}

