/**
 * New node file
 */
/**
 * New node file
 */
var Database=require("../Database/mongooseConnect.js");
var Util=require("../Utilities/utilities.js");

function States(id){
	
	this.simulation_id = id;
	
	this.statesJSON = {};
	this.statesJSON.simulation_id = id
	this.statesJSON.state = [];
	this.statesJSON._id = (new Database.StateObject())._id;
	
	//functions
	this.addState = addState;

}

function createNewStatesObject(simulation_id){
	var New_StatesObj = new States(simulation_id);
	return New_StatesObj;
}

function addState( new_state){
	this.statesJSON.state.push(new_state);
}

module.exports.createNewStatesObject = createNewStatesObject;