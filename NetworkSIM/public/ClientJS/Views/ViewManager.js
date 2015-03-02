/**
 * getLoginView
 * I'm not entirely sure, I believe it gets the page for logging in and out
 */
function getLoginView(){
	 clearPageElements();
	
}

/**
 * notAuthorized displays the text to the user that they are not 
 * authorized.
 */
function notAuthorized() {
	var str = "<error> <h3> Sorry you are not authorized </h3>" +
			"</error>";
	return str;
}

/**
 * clearPageElements clears all the elements on the page by setting 
 * their inner html to empty.
 */
function clearPageElements(){
	 clearFooter();
	 clearHeader();
	 clearNav();
	 clearSideBar();
	 clearContainer();
	 clearSection();
}

/**
 * clearFooter clears the footer on the page 
 */
function clearFooter(){
	var w =document.getElementsByTagName("footer")[0];
	w.innerHTML = '';
}

/**
 * clearNav clears the navigation bar on the page 
 */
function clearNav(){
	var y = document.getElementsByTagName("nav")[0];
	y.innerHTML = '';
}

/**
 * clearSideBar clears the side bar on the page 
 */
function clearSideBar(){
	var a = document.getElementsByTagName("aside")[0];
	a.innerHTML = '';
}

/**
 * clearHeader clears the header on the page 
 */
function clearHeader(){
	var z = document.getElementsByTagName("header")[0];
	z.innerHTML = '';
	
}

/**
 * clearContainer clears the container on the page 
 */
function clearContainer(){
	var a = document.getElementById("content");
	a.innerHTML = '';
	
}

/**
 * clearFooter clears the section on the page 
 */
function clearSection(){
	var y = document.getElementsByTagName("section")[0];
	y.innerHTML = '';
}

/**
 * Get Html Elements
 * ----------------------
 */

/**
 * getFooter gets the information within footer
 */
function getFooter(){
	var w =document.getElementsByTagName("footer")[0];
	return w;
}

/**
 * getHeader gets the information within header
 */
function getHeader(){
	var x = document.getElementsByTagName("header")[0];
	return x;
}

/**
 * getSidebar gets the information within the sidebar
 */
function getSideBar(){
	var y = document.getElementsByTagName("aside")[0];
	return y;
}

/**
 * getSection gets the information within section
 */
function getSection(){
	var y = document.getElementsByTagName("section")[0];
	return y;
}

/**
 * getContainer gets the information within the container
 */
function getContainer(){
	var a = document.getElementById("content");
	//console.log(a);
	return a;
	
}

/**
 * Views, what is shown to the user
 * ---------------------------------
 */

function makeNetwork(element){
	var network_name = document.getElementById(element).value;
	if(network_name !== null){
		createNetwork(network_name);
	}
}

/**
 * not really sure what this does, I'll leave it to you olanre
 * @param timeout
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
 * loadStyleSheet loads a css style sheet to the page
 * @param src: the stylesheet to load to the page (I believe)
 */
function loadStyleSheet(src){
    if (document.createStyleSheet) document.createStyleSheet(src);
    else {
        var stylesheet = document.createElement('link');
        stylesheet.href = src;
        stylesheet.rel = 'stylesheet';
        stylesheet.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
    }
}
function loadJSFile(path){
	 var fileref=document.createElement('script');
     fileref.setAttribute("type","text/javascript");
     fileref.setAttribute("src", path);
     document.getElementsByTagName("head")[0].appendChild(fileref)
}
//Here all the different pages are stored in different scripts 
//labeled "template[n]" in the html file.

/**
 * newSimulationView changes the view to the page where simulation
 * can be created.
 */
function newSimulationView(){
	var simulation_view = document.getElementById('template10');
	var html = simulation_view.innerHTML;
	var content = getContainer();
	content.innerHTML = html;
}
/**
 * createNetworkView changes the view to the page where a new network may
 * be created
 */
function createNetworkView(){
	var network_view = document.getElementById('template1');
	var html = network_view.innerHTML;
	var content = getSection();
	content.innerHTML = html;
}

/**
 * defaultsideBarView sets the sidebar to look like template5
 * located in the javascript of index.html
 */
function defaultsideBarView(){
	var sidebar = document.getElementById('template5');
	var aside = getSideBar();
	html = sidebar.innerHTML;
	aside.innerHTML = html;
}

/**
 * defaultheaderView sets the header of the page to 
 * template 6
 */
function defaultheaderView(){
	var header = document.getElementById('template6');
	var head= getHeader();
	head.innerHTML = header.innerHTML;
	
}

/**
 * simulationSideBarView  sets the sidebar to the sidebar 
 * for when viewing simulations, which is template 9
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

	var local_application = get_local_application();
	var local_simulation_list = get_local_session();
	defaultheaderView();
	

	var simulations = local_application.simulation_list;
	var html =  SimulationListTemplate(simulations);
	var content = getContainer();
	defaultsideBarView();

	loadJSFile('../js/network-topology.js');
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
	
	var local_application = get_local_application();
	var local_simulation_list = get_local_session();
	defaultheaderView();
	
	var simulations = local_application.simulation_list;
	var html =  SimulationListTemplate(simulations);
	var content = getContainer();
	defaultsideBarView();
	
	loadStyleSheet('../css/topologyView.css');
	loadStyleSheet('../css/EventLogView.css');
	loadJSFile('../js/EventLogView.js');
	loadJSFile('../js/interact-1.2.2.js');
	loadJSFile('../js/network-topology.js');
	
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
 * appDefaultView gets the front page of the application.
 */
function appDefaultView(){
	defaultheaderView();
	if(getVerified() == false){
		alert('You do not have permission to access this. Please get a token first.');
		//AccountView();
	}else{
		var app = viewDeviceView();
		var content = getContainer();
		content.innerHTML = app;
		simulationSideBarView();
		
	}
}
/**
* Actual HTML Application view without the iterators or local and global count
 */
function appView(){
	return document.getElementById('template7').innerHTML;
	
}


/**
 * Function to render the simulation list view 
 * First clear the naviation, footer and Section elements
 * Then render the view from the provided template. Populating the Template with the list
 * of simulations from the local application simulation list
 */
function simulationListView(){
	//sets the header view
	defaultheaderView(); 
	//clears everything on the page
	clearNav();
	clearFooter();
	clearSection();
	//gets the local application and the local session
	var local_application = get_local_application();
	var local_simulation_list = get_local_session();
	
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
 * RegisterView changes the view of the page to the registration
 * page, which is template 8.
 */
function RegisterView(){
	var html = document.getElementById('template8').innerHTML;
	var content = getContainer();
	content.innerHTML = html;
}

/**
 * AccountView changes the view of the page to the information 
 * about that user's account.
 */
function AccountView(){
	var html = AccountTemplate();
	var content = getContainer();
	content.innerHTML = html;
}

/**
  * THe view to display the number of networks in a given simulation
 * the list of networks of obtained from the configuration map
 * then view is then rendered using the template and the list provided.
 */
function NetworksListView(){
	var lists = getNetworks();
	console.log(lists);
	var html = NetworksListTemplate(lists);
	getSection().innerHTML = html;
}

/** The view for displaying the number of devices in a network. 
* First the number of networks is obtained, then the number of 
* devices within each network is calculate and rendered using the device template
* the final table is entered into the section element
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

function SimulationStatesView(){
	var local_session  = get_local_session();
	var local_states = get_local_states();
	var timestamp = new Date();
	var html = "<div class  = 'container'> <table>";
	html += "<tr> <td> <div onclick = 'generateTopology(&quot;" + local_session.config_map + " &quot;)' > " +
			"Current State at " + timestamp + " </div> </td> </tr>"
	html += SimulationStatesTemplate(local_states.states);
	html += "</table> </div>";
	//noah call the divs you want to put the Simulation states list here
}

function updateStatesView(timestamp){
	var local_states = get_local_states();
	var states  = local_states.states;
	for(var i = 0; i < states.length; i++){
		if(states.timestamp == timestamp )
			var simulation  = states.id;
			//generate the topography from the configuration map
			//should only be read only however, can't move anything around
			generateTopology(simulation.configMap);
			//update the logs with the simumation logs
			var html = SimulationLogsTemplate(simulatin.activity_logs);
			var footer = getFooter();
			footer.innerHTML = html;
	}
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

/**
 * loadAppContent loads the content from a sync to the server
 */
function loadAppContent(){
	Sync2Server();	
	updateAllViews(400);
	
}