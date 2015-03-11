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
	this.getSimulation = getSimulation;
}

function createNewHistory_State(simulation, timestamp){
	var New_State = new History_State(simulation, timestamp);
	return New_State;
}

function getSimulation(){
	return this.simulation;
}

module.exports.createNewHistory_State = createNewHistory_State;