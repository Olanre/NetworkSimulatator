/**********TEST THESE***************
*/

/**
 * gets all partitions with 2 or more networks in them
 */
function getAllNonsingularPartitions(partition_list){
	var nonsingular_partitions=[];
	if(partition_list!==null){
		for(var i=0; i<partition_list.length;i++){
			var network_list=partition_list[i].network_list;
			if(network_list.length>1){
				nonsingular_partitions.push(partition_list[i]);
			}
		}
		return nonsingular_partitions;
	}
	else{
		console.log('Error: getAllNonsingularPartitions was passed a null partition_list');
	}
}

/**
 * checks if partition is a real partition or just a free list
 */
function isRealPartition(partition){
	if(partition!==null){
		//if has more than one network, must be a real partition
		if (partition.network_list.size>1){
			return true;
		}
		//in the case that this partition has 0 objects, this is an error
		else if(partition.network_list.size!==1){
			console.log('Error: partition with id='+partition._id+' has no networks');
			return false;
		}
		else{
			//if the singular network in this partition has a name
			if(partition.network_list[0].network_name!==''&&partition.network_list[0].network_name!==null){
				return true;
			}
			else{
				return false;
			}
		}
	}
	else{
		console.log('Error: isRealPartition was passed a null partition');
	}
}