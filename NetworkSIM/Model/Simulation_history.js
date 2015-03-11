/**
 * New node file
 */
/**
 * New node file
 */
var Database=require("../Database/mongooseConnect.js");
var Util=require("../Utilities/utilities.js");

function Simulation_History(id){
	
	this._id = id;
	
	this.simulation_historyJSON = {};
	this.simulation_historyJSON.simulation_id = id
	this.simulation_historyJSON.state = [];
	
	//functions
	this.addState = addState;

}

function createNewSimulationHistory(simulation_id){
	var New_StatesObj = new Simulation_History(simulation_id);
	return New_StatesObj;
}

function addState( new_state){
	this.simulation_historyJSON.state.push(new_state);
}

module.exports.createNewSimulationHistory = createNewSimulationHistory;