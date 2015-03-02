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
 * Sets the sidebar to the appropriate sidebar for being within a simulation
 */
function simulationSideBarView(){
	var sidebar = document.getElementById('template9');
	var aside = getSideBar();
	aside.innerHTML = sidebar.innerHTML;
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