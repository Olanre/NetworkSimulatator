function Network(networkName, networkType){
	//Required
	this.networkName = networkName; // String
	//Required
	this.networkKind = networkKind; // Constant: WiFi, GSM
	//Required
	this.deviceIterator = new DeviceIterator(); // Returns an iterator that provides Device objects
		  
	this.partition={};
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
	this.connectNetwork = function (network){
		this.partition.mergePartitions(network.partition);
		network.partition=this.partition;
		network.networkJSON.partition_name=this.partition_name;
		Database.modifyNetworkByName(network.network_name,networkJSON);
	};
	//Required
	exports.disconnectNetwork = function(network){
		this.partition.dividePartition(network)
		network.partition={};
		Database.modifyNetworkByName(network.network_name,networkJSON);
	};

};