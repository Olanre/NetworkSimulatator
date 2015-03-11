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
	var options=generateSimulationOptions(simulations);
}

function generateSimulationOptions(simulation_description_list){
	var simulation_options='';
	for (var i=0;i<simulation_description_list.length;i++){
		console.log(i);
		simulation_options+=generateSimulationOption(simulation_description_list[i]);
	}
	return simulation_options;
}

function generateSimulationOption(simulation_description){
	var option= "<option value='"+simulation_description.simulation_id+">"+simulation_name+"</option>";
	return option;
}