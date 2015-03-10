/**
 * New node file
 */
var Database=require("../Database/mongooseConnect.js");
var Util=require("../Utilities/utilities.js");

function State(simulation, timestamp, devices){
	
	this.simulation = simulation;
	
	this.stateJSON = {};
	this.stateJSON.simulation = simulation;
	this.stateJSON.timestamp = timestamp;
	this.stateJSON.devices = devices;
	this.stateJSON._id = (new Database.StateObject())._id;
	
	//functions
	this.setDevices = setDevices;
	this.setSimulation = setSimulation;
}

function createNewState(simulation, timestamp, devices){
	var New_State = new State(simulation, timestamp, devices);
	return New_State;
}

function setDevices( new_devices_list){
	this.devices = new_devices_list;
}

function setSimulation( new_simulation){
	this.simulation = new_simulation;
}

module.exports.createNewState = createNewState();