/**
 * New node file
 */
var Database=require("../Database/mongooseConnect.js");
var Util=require("../Utilities/utilities.js");
var statemodel

function History_State(simulation){
	
	this.simulation = simulation;
	
	this.stateJSON = {};

	//functions
	this.getSimulation = getSimulation;
	this.attachJSON = attachJSON;
}

function createNewHistory_State(simulation, timestamp){
	var New_State = new History_State(simulation);
	var stateJSON = {};
	stateJSON.simulation = simulation;
	stateJSON.timestamp = timestamp;
	attachJSON( stateJSON);
	return New_State;
}

function getSimulation(){
	return this.simulation;
}

function attachJSON( stateJSON){
	this.stateJSON = stateJSON;
}

module.exports.createNewHistory_State = createNewHistory_State;