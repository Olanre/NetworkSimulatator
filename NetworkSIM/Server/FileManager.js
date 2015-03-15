var path = require('path');
var fs=require('fs');
var mkdirp = require('mkdirp');
//var SimulationManager = require("./SimulationManager.js");
var ApplicationManager = require("./ApplicationManager.js");
var RDTManager = require("./RDTManager.js");

function uploadAllFiles(event_data){
	var files=event_data.files;
	var type = event_data.type;
	var folder_name = event_data.name;
	
	var spec = JSON.parse(event_data.spec);
	var simulation_id = event_data.simulation_id;
	var location = "./";
	
	//console.log(__dirname);
	if(type=="App"){
		
		location = "../apps/"+folder_name;
		mkdirp(__dirname + "/" +  location, function(err) { 
			if(!err){
				
				for(var i=0;i<files.length;i++){
					
					uploadFile(files[i],location + '/');
					
				}
				ApplicationManager.attachApp( location, simulation_id, spec);
			}
		});
		
		
	}else if(type=="RDT"){
		
		location = "../rdts/"+folder_name;
		mkdirp(__dirname + "/" +location, function(err) { 
			if(!err){
				
				for(var i=0;i<files.length;i++){
					
					//uploadFile(files[i],location + '/');
				}
				RDTManager.attachRDT(location, simulation_id, spec);
			}
		});
	}
	

}

function uploadFile(file,dir){
	fs.writeFile(path.resolve(__dirname,dir+file.name),file.data,function(err){
		if(err) console.log(err);
	});
}

module.exports.uploadFile=uploadFile;
module.exports.uploadAllFiles=uploadAllFiles;