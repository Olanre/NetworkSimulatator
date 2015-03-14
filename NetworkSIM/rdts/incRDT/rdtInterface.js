var Counter = require('./counter');

exports.init = function(networkIterator, deviceIterator) {
  while (deviceIterator.hasNext()) {
	  var dev = deviceIterator.first();
	  deviceIterator.next().replicateRDT(new Counter());
	  console.log(dev);
  }
};

