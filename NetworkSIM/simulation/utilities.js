exports.size=function size(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
};


exports.merge_objects = function merge_objects(obj1,obj2){
	    for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
	    return obj1;
};
exports.compareObjects=function(obj1,obj2){
	if(Object.keys(obj1).length!=Object.keys(obj2).length)return false;
	else{
		var equal=true;
		for(key in obj1){
			if(obj2[key]==obj1[key])equal=true;
			else{
				return false;
			}
		}
		return equal;
	}
};
exports.replaceAll=function(find, replace, str) {
	  return str.replace(new RegExp(find, 'g'), replace);
};