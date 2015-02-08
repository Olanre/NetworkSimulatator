function importRDT(rdt){
  // Import a replicated data type to use in the simulation

  /* The RDT will have a common interface like the following after you import
   * it:
   *
   *   rdt.init(networkIterator); // initiate the RDT type with your
   *   networkIterator from the simulation
   *
   * For a simple integer counter RDT, it will also have methods to increment
   * and get the value of the counter, e.g.:
   *
   *   rdt.inc(); // increment the integer counter by one
   *   rdt.val(); // get the current value of the counter
   */
}

function importApp(app){
  // Import and initialize your web application in the simulation
}

function addNetwork(networkName, networkKind){
  // Add a network with the given name and kind to the simulation
}

function removeNetwork(networkName){
  // Remove a network with the given name from the simulation
}

function addDevice(deviceName){
  // Add a device with the given name to the simulation
}

function removeDevice(deviceName){
  // Remove a device with the given name from the simulation
}
