/**
 * CreateSimulation creates a new simulation in the application.
 */
function CreateSimulation(){
	//creates a new simulation object
	var body = wrapCreateSimulation();
	//the method to tell the server how to handle it
	var url = "/create/Simulation";
	//gets the timestamp of the simulation creation
	var timestamp = new Date();
	//adds the simulation to the application
	addSimulation2Application(body);
	//adds the creation of the simulation to the event queue
	addToEventQueue(url, body, timestamp);
	//sets the view of the user to the lists of simulations 
	simulationListView();
	
}