/**
 * Network Iterator
 */
function NetworkIterator(){
	networkList = Simulation.getNetworks();
	
  this.index=0;
  //Required
  this.first = function() {
    return networkList[0];
  };
  //Required
  this.next = function() {
	  var network=networkList[index];
	  index++;
	  return network;
  };
  //Required
  this.hasNext = function() {
    return this.index<networkList.length;
  };
  //Required
  this.reset = function() {
    this.index=0;
  };
  //Required
  this.each = function(callback) {
    for (var item = this.first(); this.hasNext(); item = this.next()) {
      callback(item);
    }
  };
}