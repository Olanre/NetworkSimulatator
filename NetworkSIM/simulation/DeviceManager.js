var Topology = require("./network_topology.js");
var TokenManager = require("./TokenManager.js");

var DeviceManager = function(){
	this.deviceList = [];
};

/**
 * Creates a new device and adds it to the list of devices. Returns the device.
 */
DeviceManager.prototype.addDevice = function(devID){
	var device = new Device(devID); //we will assign unique deviceIDs later
	this.deviceList[this.deviceList.length]=device;
	return device;
};

DeviceManager.prototype.getDeviceIterator=function(){
	return new Iterator(this.deviceList);
}


DeviceManager.prototype.deleteDevice = function(token){
	for (i=0; i<deviceList.length;i++)
		{
		if (deviceList[i].token === token){
			array.splice(i, 1);
		}
	}
};

function getToken(){
	return TokenManager.generateToken();
}

module.exports = DeviceManager;
module.exports.getToken = getToken;