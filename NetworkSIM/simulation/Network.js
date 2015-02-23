
//Required
this.addDevice = function(device){
  deviceList.push(device);
};

//Required
this.removeDevice = function(device){
 var deviceIndex=deviceList.indexOf(device);
 deviceList.splice(deviceIndex,1);
};
//Required
this.connectNetwork = function(network){
  var partition=network.partition;
  this.partition=partition;
  partition.addNetwork(this);
};
//Required
this.disconnectNetwork = function(network){
  var partition=network.partition;
  if(this.partition===partition){
  	this.partition={};
  }
  partition.removeNetwork(this);
};