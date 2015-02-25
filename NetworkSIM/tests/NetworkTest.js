/**
 * Can't test connectNetwork or DisconnectNetwork as requires partition object
 * can't test add or remove device as require simulation and 
 * config map
 */
var Network=require("../simulation/Network.js");
var Database=require("../Database/mongooseConnect.js");
var Util=require("../simulation/utilities.js");
var Device=require("../simulation/Device.js");

var blankNetworkJSON=Network.getTemplate();
console.log("This is what a blank network looks like in the database");
console.log(blankNetworkJSON);

console.log("Constructor test for the network class");
var newNetwork=new Network.createNewNetwork("test");

console.log("Testing the getJSON function");
console.log(newNetwork.getJSON);



