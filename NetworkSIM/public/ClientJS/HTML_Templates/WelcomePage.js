function getWelcomePage(){
	document.getElementById('title').innerHTML="<span id='welcome' class='fade-sideways-text'>Welcome</span>";
	document.getElementById('content').innerHTML="<div id='welcome-simulation-info'>"+
		"<button id='create-simulation-button'>Create New Simulation</button>"+
		"<br>"+
		"<select size = '10' id ='join-simulation-area'></select>"+
		"</div>";
}