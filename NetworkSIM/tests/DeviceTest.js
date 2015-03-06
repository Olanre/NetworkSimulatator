var Device=require("../Model/Device.js");
var Util=require("../Utilities/utilities.js");
var DB = require("../Database/mongooseConnect.js");

var Car = new DB.User();
Car['token'] = 'Hellojhrwubgnbvni';
Car.networks_created.push("Hello Me");
console.log(Car);

var JSONDeviceTemplate={
	current_device_name:undefined,
	token:undefined,
	email:undefined,
	registeredOn:undefined,
	current_simulation:undefined,
	current_partition:undefined,
	current_network:undefined,
};

var deviceJSON={
		current_device_name:"testname",
		token:"xyz1234",
		email:undefined,
		registeredOn:undefined,
		current_simulation:"sim sim",
		current_partition:undefined,
		current_network:undefined,
}


testDeviceCreation=function(){
	var createdDevice=Device.createNewDevice();
	var result=Util.compareObjects(createdDevice.deviceJSON,JSONDeviceTemplate);
	if(!result) console.log(createdDevice.deviceJSON);
	var text=result? 'passed': 'failed';
	console.log("createNewDevice " +text);
	return result;
}

testDeviceLoading=function(){
	var loadedDevice=Device.loadDeviceFromJSON(deviceJSON);
	var result=Util.compareObjects(loadedDevice.deviceJSON,deviceJSON);
	var text=result?'passed':'failed';
	console.log("loadDeviceFromJSON "+text);
	return result;
}


module.exports.testDevice=function(){
	var functions=[];
	functions.push(testDeviceCreation);
	functions.push(testDeviceLoading);

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

