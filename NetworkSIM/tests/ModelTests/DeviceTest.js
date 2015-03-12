var Device=require("../../Model/Device.js");
var Util=require("../../Utilities/utilities.js");
var Network=require("../../Model/Network.js");

//connection to database
var mongoose = require('mongoose');
//get models
var User = require("../../Database/dbModels/userModel.js");
var Userm = mongoose.model("User");


var JSONDeviceTemplate={
		token:"",
		email:"",
		verified: false,
		current_partition: "",
		current_network: "",
		registeredOn: "",
		admin: false,
		networks_created: [],
		current_simulation: "",
		current_device_name: "",
		activity : "",
};

var deviceJSON=({
		current_device_name:"testname",
		token:"7777777",
		email:"",
		dddd:"",
		registeredOn:'',
		current_simulation:"",
		current_partition:"",
		current_network:"",
});


testDeviceCreation=function(){
	var createdDevice=Device.createNewDevice('','69696969696969','','');
	createdDevice.deviceJSON.save();
	console.log("createNewDevice passed");
	return true;
	
}

testDeviceLoading=function(){
	var DJ=Userm.findOne();
	var loadedDevice=Device.loadDeviceFromJSON(DJ);
	var result=Util.compareObjects(loadedDevice.deviceJSON,DJ);
	console.log(loadedDevice.deviceJSON);
	if(!result) console.log(loadedDevice.deviceJSON);
	var text=result?'passed':'failed';
	console.log("loadDeviceFromJSON "+text);
	return result;
}



testUser = function(){
	var empty = new User();
	console.log(empty);	
	var aUser = new User(deviceJSON);
	//console.log(aUser);
	aUser.save();
	var another = new User(deviceJSON);
	another.token = "1414";
	//Userm.modifyUser(123123123, another);
	
	
}

module.exports.testDevice=function(){
	var functions=[];
	functions.push(testDeviceCreation);
	functions.push(testDeviceLoading);
	//functions.push(testUser);
	var continueTesting=true;
	for(var i=0;i<functions.length;i++){
		continueTesting=continueTesting&&functions[i]();
		if(!continueTesting){
			break;
		}
	}
	return continueTesting;
}

module.exports.testDevice();

