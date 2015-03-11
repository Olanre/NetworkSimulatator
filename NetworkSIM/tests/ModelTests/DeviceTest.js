var Device=require("../../Model/Device.js");
var Util=require("../../Utilities/utilities.js");
var Network=require("../../Model/Network.js");


var mongoose = require('mongoose');
//get models
var User = require("../../Database/dbModels/userModel.js");
var Userm = mongoose.model("User");
var Usermodel = mongoose.model
//var DB = require("../Database/mongooseConnect.js");

//var Car = new DB.User();
//Car['token'] = 'Hellojhrwubgnbvni';
//Car.networks_created.push("Hello Me");
//console.log(Car);

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
		registeredOn:undefined,
		current_simulation:"sim sim",
		current_partition:"",
		current_network:"",
});


testDeviceCreation=function(){
	var createdDevice=Device.createNewDevice('','','','');
	var result=Util.compareObjects(createdDevice.deviceJSON,JSONDeviceTemplate);
	if(!result) console.log(createdDevice.deviceJSON);
	var text=result? 'passed': 'failed';
	console.log("createNewDevice " +text);
	return result;
}

testDeviceLoading=function(){
	var loadedDevice=Device.loadDeviceFromJSON(deviceJSON);
	var result=Util.compareObjects(loadedDevice.deviceJSON,deviceJSON);
	if(!result) console.log(loadedDevice.deviceJSON);
	var text=result?'passed':'failed';
	console.log("loadDeviceFromJSON "+text);
	return result;
}

testUser = function(){
	var empty = new User();
	console.log(empty);	
	empty
	var aUser = new User(deviceJSON);
	//console.log(aUser);
	aUser.save();
	var another = new User(deviceJSON);
	another.token = "1414";
	//Userm.modifyUser(123123123, another);
	
	
	
}







module.exports.testDevice=function(){
	var functions=[];
	//functions.push(testDeviceCreation);
	//functions.push(testDeviceLoading);
	functions.push(testUser);
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

