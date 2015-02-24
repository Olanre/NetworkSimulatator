var Network=require("../simulation/Network.js");
var Database=require("../Database/mongooseConnect.js");
var Util=require("../simulation/utilities.js");

var blankNetworkJSON=Network.getTemplate();
console.log("This is what a blank network looks like in the database");
console.log(blankNetworkJSON);

console.log("Constructor test for the network class");
var newNetwork=new Network.createNewNetwork("test");
console.log(newNetwork.networkJSON);