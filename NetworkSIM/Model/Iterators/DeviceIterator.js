/**
 * Device Iterator
 * @param deviceList is an ARRAY of device OBJECTS
 **/
function DeviceIterator(deviceList){
	this.deviceList=deviceList
	
	this.index=0;
  //Required
  this.first = function() {
	  return deviceList[0];
  };
  //Required
  this.next = function() {
	  var device=deviceList[index];
	  index++;
	  return device;
  };
  //Required
  this.hasNext = function() {
	  return this.index<deviceList.length;
  };
  //Required
  this.reset = function() {
	  this.index=0;
  };
  //Required
  /**
   * Does some callback function on each item in the deviceList
   */
  this.each = function(callback) {
	  for (var item = this.first(); this.hasNext(); item = this.next()) {
	      callback(item);
	    }
  };
}