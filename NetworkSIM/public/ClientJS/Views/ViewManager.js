/**
 * Renders the start page
 */
window.onload = function(){
	defaultsideBarView();
	loadStyleSheet('../css/bootstrap.min.css');
	loadStyleSheet('../css/dashboard.css');
	
	loadAppContent();	
}

/**
 * loadAppContent loads the content from a sync to the server
 */
function loadAppContent(){
	syncWithServer();
	updateAllViews(400);
	
}


/**
 * updates all of the views 
 */
function updateAllViews( timeout){
	setTimeout(function() {
		simulationListView();
	}, timeout);
	
	setTimeout(function() {
		AccountView();
	}, timeout);
	
	setTimeout(function() {
		appDefaultView();
	}, timeout);	
}


/**
 * Shows the user's account information
 */
function AccountView(){
	var html = AccountTemplate();
	var content = getContainer();
	content.innerHTML = html;
}

/**
 *Gets the view of an application where you canincrement a counter
 */
function appView(){
	return document.getElementById('template7').innerHTML;
}


/**
 * Displays the user's information
 */
function appDefaultView(){
	//sets the top bar to be the default look
	defaultheaderView();
	if(getVerified() == false){
		alert('You do not have permission to access this. Please get a token first.');
	}else{
		//sets the page to view to 'user information' page
		var app = viewDeviceTemplate();
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
	//gets the local application and the local session
	var local_application = get_local_simulation_names();
	//var local_simulation_list = get_local_session();
	
	//gets the list of simulations
	var simulations = local_application.simulation_list;
	//adds the list of simulations into the page
	var html =  SimulationListTemplate(simulations);
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
	defaultheaderView(); 
	
	clearNav();
	clearFooter();
	clearSection();

	var local_application = get_local_simulation_names();
	defaultheaderView();
	

	var simulations = local_application.simulation_list;
	var html =  SimulationListTemplate(simulations);
	var content = getContainer();
	defaultsideBarView();

	loadJSFile('../gui/toplogyManipulationGUI.js');
	loadStyleSheet('../css/topologyView.css');
	var html="<div id='bigDiv'>" +
			"<svg></svg>" +
			"<script src='../public/ClientJS/interact-1.2.2.js'></script>" +
			"<script src='../public/ClientJS/toplogyManipulationGUI.js'></script>" +
			"<br><button class='buttton' type='button' onclick = createDeviceGraphic()>New Device</button>" +
					"<button class='buttton'  type='button' onclick = createNetworkGraphic()>New Network</button>" +
							"<button class='buttton'  type='button' onclick = generateTopology(testConfigMap1,800)>Load Configuration 1</button>" +
									"<button class='buttton' type='button' onclick = generateTopology(testConfigMap2,800)>Load Configuration 2</button>" +
											"<button class='buttton' type='button' onclick = generateTopology(testConfigMap3,800)>Load Configuration 3</button>" +
													"<button class='buttton' type='button' onclick = clearCanvas()>Clear Canvas</button>" +
															"</div>";
	var content = getContainer();
	content.innerHTML = html;
}

/***
 * A view which allows you to view the logs for devices and simulations based on a particular timestamp
 */
function eventLogsView(){
	defaultheaderView(); 
	
	clearNav();
	clearFooter();
	clearSection();
	
	var local_application = get_local_simulation_names();
	defaultheaderView();
	
	var simulations = local_application.simulation_list;
	var html =  SimulationListTemplate(simulations);
	var content = getContainer();
	defaultsideBarView();
	
	loadStyleSheet('../css/topologyView.css');
	loadStyleSheet('../css/EventLogView.css');
	loadJSFile('../view/EventLogView.js');
	loadJSFile('../gui/interact-1.2.2.js');
	loadJSFile('../gui/toplogyManipulationGUI.js');
	
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
function RegisterView(){
	var html = document.getElementById('template8').innerHTML;
	var content = getContainer();
	content.innerHTML = html;
}

/**
 * Displays the list of all networks not sure if necessary
 */
function NetworksListView(){
	var lists = getNetworks();
	console.log(lists);
	var html = NetworksListTemplate(lists);
	getSection().innerHTML = html;
}

/**
 * Displays the list of all devices
 */
function DeviceListView(){
	var netlist = getNetworks();
	
	var html = "<div class = 'container'> " +
	"<table>";
	for(var i = 0; i < netlist.length; i ++ ){
		var devices = getDevices(netlist[i]);
		
		html += DevicesListTemplate(devices);
	}
	html += "</table>" +
	"</div><br>";
	getSection().innerHTML = html;
}

/**
 * changes the page view to the logs of this user.
 */
function LogsView(){
	var logs = getLogs();
	var html = SimulationLogsTemplate(logs);
	var footer = getFooter();
	footer.innerHTML = html;
}

