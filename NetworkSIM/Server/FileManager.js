var path = require('path');
var fs=require('fs');

function uploadAllFiles(event_data){
	var files=event_data.files;

	for(var i=0;i<files.length;i++){
		if(files[i].type=="APP"){
			uploadFile(files[i],"../apps/"+event_data.simulation_name+"/");
		}
		else{
			uploadFile(files[i],"../rdts/"+event_data.simulation_name+"/");
		}
	}
}

function uploadFile(file,dir){
	fs.writeFile(path.resolve(__dirname,dir+file.name),file.data,function(err){
		if(err) console.log(err);
	});
}

module.exports.uploadFile=uploadFile;
module.exports.uploadAllFiles=uploadAllFiles;