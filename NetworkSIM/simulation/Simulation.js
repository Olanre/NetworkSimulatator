var Device = require("./Device.js");
var Network = require("./Network.js");
var Partition= require("./Partition.js");
var Database=require("../Database/mongooseConnect.js");
var Util=require("./utilities.js");

function Simulation(simulation_name){
	
	this.freeList = new Network.createNewNetwork('freelist',''); 
	this.partition_list = [];
	//this.networkIterator = new NetworkIterator();
	this.simulation_name = simulation_name;
	this.simulationJSON = module.exports.getTemplate();
	this.simulationJSON.simulation_name = simulation_name;
	this.app = '';
	this.rdt = {};
	this.simulationJSON.simulation_name=this.simulation_name;
	
	this.importRDT=importRDT;
	this.importApp=importApp;
	this.removeApp=removeApp;
	this.getNetworks=getNetworks;
	this.add2FreeList=add2FreeList;
	this.removeDeviceFromFreeList=removeDeviceFromFreeList;
	this.getDevices=getDevices;
	this.addPartition=addPartition;
	this.modifyPartition=modifyPartition;
	this.addDevice=addDevice;
	this.addNetwork=addNetwork
	this.removeDevice=removeDevice;
	this.removeNetwork=removeNetwork;
	this.removePartition=removePartition;
	this.save=save;
}

function createNewSimulation(simulation_name){
	var createdSimulation=new Simulation(simulation_name);
	//console.log(createdSimulation);
	Database.addSim(createdSimulation.simulationJSON);
	return createdSimulation;
}
function loadSimulationFromJSON(simulationJSON){
	
	var createdSimulation=new Simulation('');
	attachJSON(simulationJSON);
	
	for(partitionName in simulationJSON.config_map){
		
		Database.getPartitionByName(partitionName,function(partitionJSON){
			var createdPartition=Partition.loadPartitionFromJSON(partitionJSON);
			this.partition_list.push(createdPartition);
		});
		
	}
	
	return createdSimulation;
}

function attachJSON(simulationJSON){
		
		this.simulationJSON=simulationJSON;
		this.simulation_name = simulationJSON.simulation_name;
		this.activity_logs = simulationJSON.activity_logs;
};

function getJSON(){
		 
		return Database.getSimulationByName(this.simulation_name);
}
	
function importRDT(rdt){
		this.rdt = rdt;
}
	
function importApp(app){
		this.app = app;
		
}
	
function removeApp(app){
		this.app = '';
}
	
function getNetworks(){
		var merged = [];
		for(var i = 0; i < this.partition_list.legnth; i++){
			var Networks = this.partition_list[i].networkList;
			for( var j = 0 ; j < Networks.length; j++){
				merged = merged.concat.apply(merged, Networks[i]);
			}
							
		}
		
		return merged;
}

function add2FreeList(device){
		this.freeList.device_list.push(device);
		device.current_network = 'freelist';
		device.current_partition = 'freelist';
		
		var size = util.size(this.simulationJSON.config_map['freelist']);
		this.simulationJSON.config_map['freelist'][device.device_name] = size + 1;
		
		Database.getSimByName(this.simulationJSON.simulation_name , function(Sim){
			free_num = util.size(Sim.config_map['freelist']) + 1;
			Sim.config_map['freelist'][device.deviceJSON.current_device_name] = free_num;
			
			
			Database.modifySimByName(this.simulationJSON.simulation_name, Sim);
			
			Database.getDeviceByToken( device.deviceJSON.token, function(Device){
				Device.current_network = 'freelist';
				Device.current_partition = 'freelist';
				Database.modifyUserByToken(Device.token, device.deviceJSON);
			});
			
			
		});
}
function removeDeviceFromFreeList(device){
		
		
		var deviceIndex = this.freeList.device_list.indexOf(device)
		if( deviceIndex != -1){
			delete this.freeList.device_list[deviceIndex];
		}
		Database.getSimByName(this.simulationJSON.simulation_name, function(Sim){
			var list = Sim.config_map['freelist'];
			if( list.hasOwnProperty(device.deviceJSON.current_device_name) ){
				delete Sim.config_map['freelist'][device.deviceJSON.current_device_name];
			}

			Database.modifySimByName(this.simulationJSON.simulation_name, Sim);
			
			
		});
		
}

function getDevices(){
		var merged = [];
		//merge the javascript objects
		for(var i = 0; i < this.partitionJSON.partition_list.legnth; i++){
			var Networks = this.partitionJSON.partition_list[i].networkList;
			for( var j = 0 ; j < Networks.length; j++){
				var Devices = Networks[i].networkJSON.device_list;
				for( var k = 0; k < Devices.length; k++){
					merged = merged.concat.apply(merged, Devices[i]);
				}
			}
							
		}
		
		
}
/*
 * 1. Create the new partition object
 * 2. Add the partition object to the simulation's list
 * 3. Update the simulation JSON object to reflect the changes
 * 4. Update the simulation in the database.
 * 5. Return the new partition because why not.
 */
function addPartition(partitionName){
		var newPartition = Partition.createNewPartition(partitionName, this.simulation_name);
		this.partition_list.push(newPartition);
		
		partitonJSON = newPartition.partitionJSON; 
		this.simulationJSON.partition_list.push(partitionJSON);
		
		Database.modifySimByName(this.simulation_name, this.simulationJSON);
		return newPartition;
} 
	
function modifyPartition(partition){
		for(var i = 0; i < this.partitionList.length; i++){
			if(this.partitionList[i].partition_name == partition.partition_name){
				this.partitionList[i] = partition;
			}
		}
		
		for(var i = 0; i < this.simulationJSON.partitionList.length; i++){
			if(this.simulationJSON.partitionList[i].partition_name == partition.partitionJSON.partition_name){
				this.simulationJSON.partitionList[i] = partition.partitionJSON.partition_name;
			}
		}
		
		
}

function addDevice(deviceName){
		var d = new Date();
		var Device = new Device(deviceName);
		var deviceTemplate = Device.getTemplate();
		
		Device.current_simulation = this.simulation_name;
		Device.email = deviceName;
		device.current_device_name = deviceName;
		device.registeredOn = d.toString();
		//use the partitionList or config map
		Device.loadJSON(deviceTemplate);
		Device.deviceJSON.current_simulation = this.simulation_name;
		Device.deviceJSON.email = deviceName;
		Device.deviceJSON.current_device_name = deviceName;
		Device.deviceJSON.registeredOn = d.toString();
		
		
		Database.getSimByName(this.simulationJSON.simulation_name, function(Sim){
			
			Sim.num_devices += 1;
			Database.getApplication(function(App){
				App.total_devices += 1;
				Database.modifySimByName(this.simulation_name, Sim);
				this.add2FreeList(Device);
			});
			
			
		});
		
		//Simulation.addDevice()
	  // Add a device with the given name to the simulation
}
	
function addNetwork(networkName, networkType){
		var Network = new Network(networkName, networkType);
		var Partition = new Partition(networkName);
		Partition.addNetwork(Network);
		this.partition_list.push(Partition);
		//use the partitionList or config map
		partitonJSON = Partition.getTemplate(); 
		networkJSON = Network.getTemplate();
		partitionJSON.network_list.push(networkJSON);
		this.simulationJSON.partition_list.push(partitionJSON);
		
		Database.getSimByName(this.simulationJSON.simulation_name, function(Sim){
			//this.simulationJSON.partition_list.push(partitionJSON);
			Sim.config_map[networkName][networkName] = {};
			Sim.num_network += 1;

			Database.modifySimByName(this.simulation_name, Sim);
			
			
		});
}
/*
 * 1. Disconnect the device from its network
 * 2. Remove the device from the device list
 * 3. Update the config_map
 * 4. Update the simulation in the database.
 */
function removeDevice(deviceName){
	var deviceList=this.getDevices();
	for(index in deviceList){
		
		if(deviceList[index].device_name==deviceName){
			deviceList[index].networkObject.removeDevice(deviceList[index]);
			deviceList.splice(index,1);
			break;
		}
		
	}
	var configmap=this.simulationJSON.config_map;
	for(partition in configmap){
		for(network in configmap[partition]){
			for(device in configmap[partition][network]){
				if(device==deviceName) delete configmap[partition][network][device];
			}
		}
	}
	Database.modifySimByName(this.simulation_name,this.simulationJSON);
	
		
}
/*
 * 1. Disconnect all devices from the network
 * 2. Remove the network from its partition
 * 3. Remove the network from the network list
 * 4. Update the configmap
 * 5. Update the simulation in the database
 */
function removeNetwork(networkName){
		var networkList=this.getNetworks();
		
		for(index in networkList){
			if(networkList[index].network_name==networkName){
				for(devIndex in networkList[index].device_list){
					networkList[index].removeDevice(networkList[index].device_list[devIndex]);
				}
				networkList[index].partitionObject.removeNetwork(networkList[index]);
				networkList.splice(index,1);
			}
			break;
		}
		var configmap=this.simulationJSON.config_map;
		for(partition in configmap){
			for(network in configmap[partition]){
				if(network==networkName)delete configmap[partition][network];
			}
		}
		Database.modifySimByName(this.simulation_name,this.simulationJSON);
		
}
/*
 * 1. Disconnect all networks from the partition
 * 2. Remove the partition from the simulation's partition list
 * 3. Update the configmap
 * 4. Update the simulation in the database
 */
function removePartition(partitionName){
	
	
	for(index in this.partition_list){
		if(this.partition_list[index].partition_name==partitionName){
			for(netIndex in this.partition_list[index].network_list){
				this.partition_list[index].removeNetwork(partition_list[index].network_list[netIndex]);
			}
			this.partition_list.splice(index,1);
			break;
		}
	}
	var configmap=this.simulationJSON.config_map;
	for(partition in configmap){
		if (partition==partitionName) delete configmap[partition]
	}
	Database.modifySimByName(this.simulation_name,this.simulationJSON);
}
function save(state){
		Database.modifySimulationByName(this.simulation_name, this.simulationJSON);
		Database.saveState(state);
}

module.exports.getTemplate=function(){
	var session_data = {};
	session_data.num_devices=0;
	session_data.num_networks=0;
	session_data.simulation_population = 0;
	session_data.simulation_name ='';
	session_data.config_map = {'freelist' : {} };
	session_data.tokenMethod = "";
	//session_data.token_list=[];
	session_data.activity_logs = '';
	return session_data;
	
};
module.exports.createNewSimulation=createNewSimulation;
module.exports.loadSimulationFromJSON=loadSimulationFromJSON;
