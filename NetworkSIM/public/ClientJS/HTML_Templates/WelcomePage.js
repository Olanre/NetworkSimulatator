function getWelcomePage(){
	document.getElementById('title').innerHTML="<span id='welcome' class='fade-sideways-text'>Welcome</span>";
	document.getElementById('content').innerHTML=
		"<div id='welcome-simulation-info'>"+
			"<button id='create-simulation-button'>Create New Simulation</button>"+
			"<br>"+ 
			"<div id='join-simulation-area'>"+
				"<select size = '10' id ='join-simulation-list'>"+
				"</select>"+
			"</div>"+
		"</div>";
	//now populate the list of simulations already available
	var simulations = get_local_simulation_list();
	//string of all the simulations to be displayed in the 'join-simulation-list'
	var simulation_options='';
	for (var i=0;i<simulations.length;i++){
		var option= simulations[i].
	}
}