/**
 * Handles keeping track of all connected devices
 * @Author: Noah
 */
/***
 * Constructor, initiates a list of devices to be empty
 ***/

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
/**
 * Deletes a device from the system (should it be based on unique id, token, what?)
 */
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

//export the device manager for use
module.exports = DeviceManager;
module.exports.getToken = getToken;