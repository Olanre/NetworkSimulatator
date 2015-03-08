function reassessDisplayedTopology(){

	console.log("checking for changes to the topology");
	console.log(displayed_partition_list);

	var partition_list=get_local_simulation().partition_list;

	console.log(partition_list);

	var displayIsUpToDate=(compareObjects(partition_list,displayed_partition_list));

	if(!displayIsUpToDate){
		generateTopology(partition_list,800);
	}
	else console.log("no changes made");
}

//Begin test code
var currentSim=generateSimulationObject(3,false);
sessionStorage.setItem('simulation',JSON.stringify(currentSim));


function otherUserMakesChange(){

	var simulation=deepCopy(get_local_simulation());
	var partition_list=simulation.partition_list;

	var numPartitions=partition_list.length;
	var partitionIndex=Math.floor(Math.random()*numPartitions);


	var network_list=partition_list[partitionIndex].network_list;
	
	var numNetworks=network_list.length;
	var networkIndex=Math.floor(Math.random()*numNetworks);

	var removeDevice=Math.random()>0.5;
	if(removeDevice){
		var device_list=network_list[networkIndex].device_list;
		var deviceIndex=Math.floor(device_list.length*Math.random());

		console.log("removed "+ device_list[deviceIndex].current_device_name);

		delete device_list[deviceIndex];
	}
	else{
		console.log("removed " + network_list[networkIndex].network_name);
		delete network_list[networkIndex];
	}
	sessionStorage.setItem('simulation',JSON.stringify(simulation));
}
setInterval(otherUserMakesChange,30000);
//End test code


setInterval(reassessDisplayedTopology, 10000);

generateTopology(get_local_simulation().partition_list,1000);

