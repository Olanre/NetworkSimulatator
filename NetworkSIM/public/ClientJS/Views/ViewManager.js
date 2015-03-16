/**
 * Renders the start page
 */
window.onload = function(){
	defaultsideBarView();
	loadStyleSheet('../css/bootstrap.min.css');
	loadStyleSheet('../css/dashboard.css');
	//loadStyleSheet('../css/test.css');
	defaultheaderView();
	updateAllViews();
	
	
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
	getSection().innerHTML = html;
}

function deviceHeaderView(){
	var local_device = get_local_device();
	var local_session = get_local_simulation();
	var html = viewDeviceTemplate(local_device, local_session);
	var content = getContainer();
	content.innerHTML = html;
}

function adminAppsView(){
	removeClass('active');
	document.getElementById('nav-option-applications').className='active';

	var local_session = get_local_simulation();
	var applications = local_session.apps;
	var html = viewAdminApplicationsTemplate(applications);
	var content = getContainer();
	content.innerHTML = html;
}

function RDTsView(){
	removeClass('active');
	document.getElementById('nav-option-RDTs').className='active';

	var local_simulation = get_local_simulation();
	var rdts = local_simulation.rdts;
	var html = viewRDTsTemplate(rdts);
	var content = getContainer();
	content.innerHTML = html;
	
}

function ViewRDTSpec(_id, e){
	var local_simulation = get_local_simulation();
	var rdts = local_simulation.rdts;
	
	if(e.innerHTML.indexOf("View Specification") > -1 ){
		for(var i = 0; i < rdts.length; i++){
			if(rdts[i]._id == _id){
				var div = document.getElementById(_id);
				if(div !== null) div.innerHTML = "<code>" + JSON.stringify(rdts[i]) + "</code>";
			}
		}
		e.innerHTML = 'Hide';
	}else if( e.innerHTML.indexOf('Hide') > -1 ){
		var div = document.getElementById(_id);
		if(div !== null) div.innerHTML = "";
		e.innerHTML = 'View Specification'
	}
}

function ViewAppSpec(_id, e){
	var local_simulation = get_local_simulation();
	var apps = local_simulation.apps;
	
	if(e.innerHTML.indexOf("View Specification") > -1 ){
		for(var i = 0; i < apps.length; i++){
			if(apps[i]._id == _id){
				var div = document.getElementById(_id);
				console.log(_id);
				if(div !== null) div.innerHTML = "<code>" + JSON.stringify(apps[i]) + "</code>";
			}
		}
		e.innerHTML = 'Hide';
	}else if( e.innerHTML.indexOf('Hide') > -1 ){
		var div = document.getElementById(_id);
		if(div !== null) div.innerHTML = "";
		e.innerHTML = 'View Specification'
	}
}

function ViewApp( app_id){
	var local_simulation = get_local_simulation();
	var apps = local_simulation.apps;
	
	for(var i = 0; i < apps.length; i++){
		console.log(apps[i]);
		if(apps[i]._id == app_id){
			var location = "../apps/" + apps[i].name + "/" + apps[i].main;
			
		}
	}
	var frame = "<iframe src='" + location + "' width='100%' height='600px'> </iframe> ";
	//clears everything on the page
	clearFooter();
	clearSection();
	var content = getContainer();
	content.innerHTML = frame;
	
}
/**
 * Displays the user's information
 */
function deviceDefaultView(){
	//clears everything on the page
	clearFooter();
	clearSection();
	
	var local_device = get_local_device();
	//sets the top bar to be the default look
	defaultheaderView();
	if(getVerified() == false){
		alert('You do not have permission to access this. Please get a token first.');
	}else{
		appDefaultView();
		//sets the page to view to 'user information' page
		//sets the sidebar to the sidebar for when inside a simulation
		simulationSideBarView();
	}
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
		var apps = DeviceAppsListTemplate(local_device.apps);
		var content = getContainer();
		content.innerHTML = apps;
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
	removeClass('active');
	document.getElementById('nav-option-simCreate').className='active';
	content.innerHTML = '<h1>List of current Simulations</h1>'+html;
}

/**
 * newSimulationView changes the view to the page where a simulation may be created
 */
function newSimulationView(){
	var simulation_view = document.getElementById('template10');
	var html = simulation_view.innerHTML;
	var content = getContainer();
	//update the active link
	removeClass('active');
	document.getElementById('nav-option-simView').className='active';
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
	removeClass('active');
	document.getElementById('nav-option-viewTopology').className='active';

	document.getElementById('')
	//removes previously occuring stylesheets and javascript files if they occured before
	removeFile('topologyView.css', 'css');
	removeFile('Manipulation.js', 'js');

	defaultheaderView(); 
	
	clearNav();
	clearFooter();
	clearSection();

	var content = getContainer();
	//defaultsideBarView();
	loadStyleSheet('../css/topologyView.css');
	var html=NetworkTopologyTemplate(get_local_simulation());
	var content=getContainer();
	content.innerHTML=html;
	loadJSFile('/gui/Manipulation.js');
	/*var html="<div id='bigDiv'>" +
			"<svg></svg>" +
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
	
	generateTopology(simulation.partition_list, 800);*/
}


/***
 * A view which allows you to view the logs for devices and simulations based on a particular timestamp
 */
function eventLogsView(){
	removeClass('active');
	document.getElementById('nav-option-history').className='active';

	removeFile('topologyView.css', 'css');
	removeFile('EventLogView.css', 'css');
	removeFile('EventLogView.js', 'js');
	removeFile('Manipulation.js', 'js');

	//clearNav();
	clearFooter();
	clearSection();

	defaultheaderView();

	var content = getContainer();
	//defaultsideBarView();
	
	loadStyleSheet('../css/topologyView.css');
	loadStyleSheet('../css/EventLogView.css');
	loadJSFile('../view/EventLogView.js');
	
	
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
	loadJSFile('../gui/Manipulation.js');
	//calls the EventLogView function for viewing the history
	setTimeout(function(){
		clearCanvas();
		populatePage(get_local_history());
	}, 1000);
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
	clearNav();
	clearFooter();
	clearSection();
	clearContainer();
	
	var local_simulation = get_local_simulation();
	var aside = getSideBar();
	var sidebar = SimulationSideBarView(local_simulation._id);
	aside.innerHTML = sidebar;
	//loads the network topology
	networkTopologyView();
}


function SimulationManagementSideBarView(){
	var sidebar = document.getElementById('template18');
	
	aside.innerHTML = sidebar.innerHTML;
}
/**
 * Displays the list of all networks not sure if necessary
 */
function NetworksListView(){
	var local_simulation = get_local_simulation();
	var local_device = get_local_device();
	var lists = getAllNetworkObjects(local_simulation);
	var html = NetworksListTemplate(lists, local_device);
	
	getSection().innerHTML = html;
}

/**
 * Displays the list of all devices
 */
function DeviceListView(){
	var local_simulation = get_local_simulation();
	var devices = getAllDeviceObjects(local_simulation);
	var html =  DevicesListTemplate(devices);

	getSection().innerHTML = html;
}

/**
 * changes the page view to the logs of this user.
 */
function LogsView(){
	var logs = getLocalDeviceLogs();
	var html = LogsTemplate(logs);
	var footer = getFooter();
	footer.innerHTML = html;
}

/**
* Displays the upload page
**/

function uploadView(){
	loadJSFile('../logic/FileUpload.js');
	

	var simulation={};
	var html=uploadFileTemplate(simulation);
	var content=getContainer();
	content.innerHTML=html;
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

