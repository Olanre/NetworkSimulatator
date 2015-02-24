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

//cannot test connect and disconnect from a network, need to work on this
/*console.log("Testing device joining a network. This won't work as device is not connected to a simulation.");
console.log(newDevice.deviceJSON.current_device_name);
var newNetwork=new Network.createNewNetwork("testNetwork");
newDevice.joinNetwork(newNetwork);
console.log(newNetwork.device_list);*/

console.log("testing getting the JSON from device");
console.log(newDevice.getJSON());

//this method does not exist in mongoose connect
/*console.log("testing getting the JSON from device");
console.log(newDevice.save());*/

