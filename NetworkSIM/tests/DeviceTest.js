var Device=require("../simulation/Device.js");
var Database=require("../Database/mongooseConnect.js");
var Util=require("../simulation/utilities.js");

var blankDeviceJSON=Device.getTemplate();
console.log("This is what a blank device looks like in the database");
console.log(blankDeviceJSON);
blankDeviceJSON.current_device_name="test";
var newDevice=new Device.Device("test");
console.log("Constructor test for the device class");

console.log(newDevice.deviceJSON);
