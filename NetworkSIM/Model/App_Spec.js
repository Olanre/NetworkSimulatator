/**
 * New node file
 */
/**
 * New node file
 */
/**
 * New node file
 */
var Database=require("../Database/mongooseConnect.js");
var Util=require("../Utilities/utilities.js");
var appModel = require("../Database/dbModels/appModel.js");

function App_Spec( name){
	
	this.name = name
	this.specJSON = {};
	
	//functions
	this.getSpec = getSpec;
	this.attachJSON = attachJSON;
}

function createNewApp_Spec( spec){
	var New_Spec = new App_Spec( spec.name);
	var specJSON= new appModel();
	specJSON.name = spec.name,
	specJSON.version = spec.version;
	specJSON.description = spec.description;
	specJSON.main = spec.main;
	specJSON.rdt_list = spec.rdt_list;
	New_Spec.attachJSON(specJSON);
	specJSON.save();
	return New_Spec;
}

function attachJSON(specJSON){
	this.specJSON=specJSON
	this._id=specJSON._id;
}

function getSpec(){
	return this.specJSON;
}

module.exports.createNewApp_Spec = createNewApp_Spec;