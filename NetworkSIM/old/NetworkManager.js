/*****
The purpose of this class is to manage a group of connected networks.
@author Emily
******/



var NetworkManager = function(){
	this.networks = [];
};

NetworkManager.prototype.disconnect = function(device,network){
	network.removeDevice(device);
};

NetworkManager.prototype.connect = function(device,network){
	if(network.canJoin(device)){
		device.addNetwork(network);
		network.addDevice(device);
	} 

};


NetworkManager.prototype.addNetwork=function(networkName){
	var network= new Network();
	network.name=networkName;
	this.networks.push(network);
	return network;
};
NetworkManager.prototype.deleteNetwork=function(networkName){
	for (i=0; i<networks.length;i++)
	{
		if (networks[i].name === networkName){
			array.splice(i, 1);
		}
	}
};


// exports
module.exports = NetworkManager;