window.onload = function(){
	getWelcomePage();
	loadStyleSheet('../css/defaultView.css');
}


function getWelcomePage(){
	document.getElementById('title').innerHTML="<span id='welcome' class='fade-sideways-text'>Welcome</span>";
	document.getElementById('container').innerHTML=""
}