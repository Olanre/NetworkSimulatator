exports.size=function size(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
};
/**
* Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
* from stackoverflow
* @param obj1
* @param obj2
* @returns obj1 based on obj1 and obj2
*/
export.merge_objects = function merge_objects(obj1,obj2){
	    for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
	    return obj1;
	}