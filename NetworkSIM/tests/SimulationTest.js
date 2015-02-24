var Simulation=require("../simulation/Simulation.js");
var Database=require("../Database/mongooseConnect.js");
var Util=require("../simulation/utilities.js");

var blankSimulationJSON=Simulation.getTemplate();
console.log("This is what a blank simulation looks like in the database");
console.log(blankSimulationJSON);

console.log("Constructor test for the simulation class");
var newSimulation=new Simulation.createNewSimulation("test");
console.log(newSimulation.simulationJSON);