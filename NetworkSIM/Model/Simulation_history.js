/**
 * New node file
 */
/**
 * New node file
 */
var Database=require("../Database/mongooseConnect.js");
var Util=require("../Utilities/utilities.js");

function SimulationHistory(id){
	
	this.simulation_id = id;
	
	this.statesJSON = {};
	this.statesJSON.simulation_id = id
	this.statesJSON.state = [];
	
	//functions
	this.addState = addState;

}

function createNewStatesObject(simulation_id){
	var New_StatesObj = new SimulationHistory(simulation_id);
	return New_StatesObj;
}

function addState( new_state){
	this.statesJSON.state.push(new_state);
}

module.exports.createNewSimulationHistory = createNewSimulationHistory;