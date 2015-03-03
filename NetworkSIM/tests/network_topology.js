var SimTest=require("./SimulationTest.js");
var NetTest=require("./NetworkTest.js");
var DevTest=require("./DeviceTest.js");

if(DevTest.testDevice()) console.log("\n Device Tests passed! \n \n");
if(NetTest.testNetwork()) console.log("\n Network Tests passed! \n \n");
if(SimTest.testSimulation()) console.log("\n Simulation Tests passed! \n \n");