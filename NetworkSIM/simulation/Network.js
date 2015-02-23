/**
 * Template for Network
 */
function Network(networkName, networkType){
	//Required
	this.networkName = networkName; // String
	//Required
	this.networkKind = networkKind; // Constant: WiFi, GSM
	//Required
	this.deviceIterator = new DeviceIterator(); // Returns an iterator that provides Device objects
		  
	this.partition='';
	this.deviceList=[];
	this.networkJSON={};
	this.simulationName='';
	
	this.attachJSON=function(networkJSON){
		this.networkJSON=networkJSON;
	}
	
	this.getTemplate = function getNetwork(){
		network_data.network_name = networkName;
		network_data.network_type = networkType;
		network_data.deviceList = [];
		network_data.partition = '';
		return network_data;
	};
	
	
	//Required
	
	//we assume that we will only add devices through a network
	this.addDevice = function addDevice(device){
		this.networkJSON.deviceList.push(device.deviceJSON);
		this.deviceList.push(device);
		//need this function from andrew
		Database.saveNetworkByName(this.networkJSON.network_name, this.networkJSON);
		device.joinNetwork(this);
	};
	
	//Required
	this.removeDevice= function removeDevice(device){
		//delete from the deviceList by token
		for (var i =0; i< this.deviceList.length){
			if (this.deviceList[i].token == device.token){
				this.deviceList.splice(1,i);//this should remove the element at index i
			}
		}
		//delete from the JSON device list
		for (var i =0; i< this.networkJSON.deviceList.length){
			if (this.networkJSON.deviceList[i].token == device.token){
				this.networkJSON.deviceList.splice(1,i);//this should remove the element at index i
			}
		}
		device.leaveNetwork(this);
		Database.saveNetworkByName(this.networkJSON.network_name, this.networkJSON);
	};
	
	//Required
	//pass in a network OBJECT not the JSON
	this.connectNetwork = function connectNetwork(network){

		Database.getSimByName(this.simulationName, function(Sim){
			var thisPartitionName = this.networkJSON.partition;
			//gets the partition name of the passed in network
			var networkPartitionName = simulation.getPartition(Sim.config_map, network.networkJSON.network_name);
			var devices = Sim.config_map[networkPartitionName][network.networkJSON.network_name];
			delete Sim.config_map[networkPartitionName][network.networkJSON.network_name];
			Sim.config_map[thisPartitionName][network.networkJSON.network_name] = devices;
			
			Database.modifySimByName(simulation, Sim);
		});
	};
	//Required
	exports.disconnectNetwork = function dividePartition(network, partition_name, simulation){
		Database.getSimByName(simulation, function(Sim){
			delete Sim.config_map[partiton][network];
			Sim.config_map[network] = network;
			Database.modifySimByName(simulation, Sim);
		});
	};

};