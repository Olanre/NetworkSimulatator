var Simulation=require("../simulation/Simulation.js");
var Database=require("../Database/mongooseConnect.js");
var Util=require("../simulation/utilities.js");

var blankSimulationJSON=Simulation.getTemplate();
console.log("This is what a blank simulation looks like in the database");
console.log(blankSimulationJSON);

console.log("Constructor test for the simulation class");
var newSimulation=new Simulation.createNewSimulation("test");
console.log(newSimulation.simulationJSON);

console.log("testing getJSON");
console.log(newSimulation.getJSON());

console.log(newSimulation.simulationJSON);
>>>>>>> branch 'master' of eai540@garfield.cs.mun.ca:/users/labnet3/st6/gz8240/cs4770/sim-2
console.log(newSimulation.simulationJSON);
>>>>>>> branch 'master' of eai540@garfield.cs.mun.ca:/users/labnet3/st6/gz8240/cs4770/sim-2
