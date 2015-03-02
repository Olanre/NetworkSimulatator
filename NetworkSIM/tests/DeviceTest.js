var Device=require("../simulation/Device.js");
var Util=require("../simulation/Utilities.js");
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


module.exports.testDeviceCreation=function(){
	var createdDevice=Device.createNewDevice();
	var result=Util.compareObjects(createdDevice.deviceJSON,JSONDeviceTemplate);
	var text=result? 'passed': 'failed';
	console.log("createNewDevice " +text);
}

module.exports.testDeviceLoading=function(){
	var loadedDevice=Device.loadDeviceFromJSON(deviceJSON);
	var result=Util.compareObjects(loadedDevice.deviceJSON,deviceJSON);
	var text=result?'passed':'failed';
	console.log("loadDeviceFromJSON "+text);
}


module.exports.testDeviceCreation();
module.exports.testDeviceLoading();