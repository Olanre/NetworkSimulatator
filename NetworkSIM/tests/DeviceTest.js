var Device=require("../simulation/Device.js");
var Database=require("../Database/mongooseConnect.js");
var Util=require("../simulation/utilities.js");
var Network=require("../simulation/Network.js");

var blankDeviceJSON=Device.getTemplate();
console.log("This is what a blank device looks like in the database");
console.log(blankDeviceJSON);
blankDeviceJSON.current_device_name="test";
var newDevice=new Device.createNewDevice("test", "ABIGTOKEN");
console.log("Constructor test for the device class");

console.log(newDevice.deviceJSON);

console.log("Testing device joining a network");
console.log(newDevice.deviceJSON.current_device_name);
var newNetwork=new Network.createNewNetwork("testNetwork");
newDevice.joinNetwork(newNetwork);
console.log(newNetwork.device_list);

