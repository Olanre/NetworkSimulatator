var Util=require("../simulation/utilities.js");
var Device=require("../simulation/Device.js");
var Network=require("../simulation/Network.js");
var Partition=require("../simulation/Partition.js");
var Simulation=require("../simulation/Simulation.js");

var JSONSimulationTemplate={
		partion_list : undefined,
		num_devices: undefined,
		num_networks: undefined,
		simulation_population: undefined,
		simulation_name: undefined,
		config_map: undefined,
		tokenMethod : undefined,
		activity_logs : undefined,
};

var simulationJSON={
		partion_list : undefined,
		num_devices: 3,
		num_networks: 1,
		simulation_population: undefined,
		simulation_name: "Test Sim",
		config_map: undefined,
		tokenMethod : 'email',
		activity_logs : undefined,
}

module.exports.testSimulationCreation=function(){
	var createdSimulation = Simulation.createNewSimulation();
	var result=Util.compareObjects(createdSimulation.simulationJSON, JSONSimulationTemplate);
	var text= result ? 'passed' : 'failed';
	console.log("createNewSimulation "+text);

	return result;
}

module.exports.testSimulationLoading=function(){

	var loadedSimulation=Simulation.loadSimulationFromJSON(simulationJSON);
	var result=Util.compareObjects(loadedSimulation.simulationJSON, simulationJSON);
	var text= result ? 'passed' : 'failed';
	console.log("loadSimulationFromJSON "+ text);

	return result;

}

module.exports.testGetNetworks=function(){
	var createdSimulation=Simulation.createNewSimulation();
	var networkList=generateXObjects(8, Network.createNewNetwork);

	for(index in networkList){
		createdSimulation.partition_list.push(networkList[index].partitionObject);
	}
	
	var result= Util.compareObjects(networkList,createdSimulation.getNetworks());
	result=result&& Util.compareObjects(createdSimulation.getNetworks(), networkList);
	var text = result ? 'passed' : 'failed';
	console.log("getNetworks "+text);

	return result;

}

function generateXObjects(x, method){
	var list=[];
	for(var i=0;i<x;i++){
		createdObject=method("object "+i)
		list.push(createdObject);
	}
	return list;
}

module.exports.testGetDevices=function(){
	var createdSimulation=Simulation.createNewSimulation();
	var deviceList=generateXObjects(22, Device.createNewDevice);

	for(index in deviceList){
		createdSimulation.partition_list.push(deviceList[index].networkObject.partitionObject);
	}
	var result= Util.compareObjects(deviceList, createdSimulation.getDevices());
	result=result&& Util.compareObjects(createdSimulation.getDevices(),deviceList);
	var text= result ? 'passed' : 'failed';
	console.log("getDevices "+text);

	return result;

}

module.exports.testAddPartition=function(){
	var createdSimulation=Simulation.createNewSimulation();
	var partitionList=generateXObjects(3, Partition.createNewPartition);

	for(index in partitionList){
		createdSimulation.addPartition(partitionList[index]);
	}
	var result=Util.compareObjects(partitionList,createdSimulation.partition_list);
	result=result&&Util.compareObjects(createdSimulation.partition_list,partitionList);
	var text = result ? 'passed' : 'failed';
	console.log("addPartition "+ text);

	return result;

}

module.exports.testAddDevice=function(){
	var createdSimulation=Simulation.createNewSimulation();
	var deviceList=generateXObjects(12, Device.createNewDevice);

	for(index in deviceList){
		createdSimulation.addDevice(deviceList[index]);
	}
	var result=Util.compareObjects(createdSimulation.getDevices(),deviceList);
	result=result&&Util.compareObjects(deviceList,createdSimulation.getDevices());
	var text= result ? 'passed' : 'failed';
	console.log("addDevice "+ text);

	return result;

}

module.exports.testAddNetwork=function(){
	var createdSimulation=Simulation.createNewSimulation();
	var network= Network.createNewNetwork("testNetwork");
	createdSimulation.addNetwork(network);

	var foundNetwork=Util.findNetworkByName(network.network_name, createdSimulation.getNetworks());
	var result = foundNetwork==-1;
	var text=result ? 'passed' : 'failed';
	console.log("addNetwork "+text);
	return result;

}

module.exports.testRemoveNetwork=function(){
	var createdSimulation=Simulation.createNewSimulation();
	var netlist=generateXObjects(4, Network.createNewNetwork);

	for(index in netlist){
		createdSimulation.addNetwork(netlist[index]);
	}

	createdSimulation.removeNetwork(netlist[3]);
	var foundNetwork=Util.findNetworkByName(netlist[3].network_name,createdSimulation.getNetworks());
	var text= foundNetwork==-1 ? 'passed' : 'failed';
	console.log("removeNetwork "+text);
	return foundNetwork==-1;
}

module.exports.testSimulation=function(){
	var functions=[];

	functions.push(module.exports.testSimulationCreation);
	functions.push(module.exports.testSimulationLoading);
	functions.push(module.exports.testGetNetworks);
	functions.push(module.exports.testGetDevices);
	functions.push(module.exports.testAddPartition);
	functions.push(module.exports.testAddDevice);
	functions.push(module.exports.testAddNetwork);
	functions.push(module.exports.testRemoveNetwork);
	var continueTesting=true;
	for(var i=0;i<functions.length;i++){
		continueTesting=continueTesting&&functions[i]();
		if(!continueTesting)break;
	}
	return continueTesting;
}

module.exports.testSimulation();