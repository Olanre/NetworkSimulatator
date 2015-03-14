/**
 * New node file
 */
/**
 * New node file
 */
var Database=require("../Database/mongooseConnect.js");
var Util=require("../Utilities/utilities.js");
var stateModel = require("../Database/dbModels/stateModel.js");

function Simulation_History(id){
	
	this._id = id;
	
	this.simulation_historyJSON = {};
	
	
	//functions
	this.addState = addState;
	this.attachJSON = attachJSON;

}

function createNewSimulationHistory(simulation_id){
	var New_StatesObj = new Simulation_History(simulation_id);
	var simulation_historyJSON = new stateModel;
	simulation_historyJSON.simulation_id = simulation_id;
	simulation_historyJSON.state = new Array();
	//console.log(simulation_historyJSON);
	attachJSON(simulation_historyJSON);
	simulation_historyJSON.save();
	return New_StatesObj;
}

function addState( stateJSON){
	console.log(simulation_historyJSON.state);
	this.simulation_historyJSON.state = stateJSON;
}

function attachJSON( json){
	//console.log(json);
	this.simulation_historyJSON = json;
}
module.exports.createNewSimulationHistory = createNewSimulationHistory;