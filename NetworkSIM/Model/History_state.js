/**
 * New node file
 */
var Database=require("../Database/mongooseConnect.js");
var Util=require("../Utilities/utilities.js");

function History_State(simulation, timestamp, devices){
	
	this.simulation = simulation;
	
	this.stateJSON = {};
	this.stateJSON.simulation = simulation;
	this.stateJSON.timestamp = timestamp;
	
	//functions
	this.setSimulation = setSimulation;
}

function createNewHistory_State(simulation, timestamp, devices){
	var New_State = new State(simulation, timestamp, devices);
	return New_State;
}

function setSimulation( new_simulation){
	this.simulation = new_simulation;
}

module.exports.createNewHistory_State = createNewHistory_State();