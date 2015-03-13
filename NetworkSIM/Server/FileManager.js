var path = require('path');
var fs=require('fs');
var mkdirp = require('mkdirp');
var SimulationManager = require("./SimulationManager.js");

function uploadAllFiles(event_data){
	var files=event_data.files;
	var type = event_data.type;
	var folder_name = event_data.name;
	var spec = JSON.parse(event_data.spec);
	var simulation_id = event_data.simulation_id;
	var location = "./";
	
	console.log(__dirname);
	if(type=="App"){
		
		location = "../apps/"+folder_name;
		mkdirp(__dirname + "/" +  location, function(err) { 
			if(!err){
				SimulationManager.attachApp( event_data.name, simulation_id, spec);
				for(var i=0;i<files.length;i++){
					if(files[i].name == 'package.json'){
						var package = JSON.parse(files[i]['data']).name;
						
					}
					uploadFile(files[i],location + '/');
				}
			}
		});
		
		
	}else if(type=="RDT"){
		
		location = "../rdts/"+folder_name;
		mkdirp(__dirname + "/" +location, function(err) { 
			if(!err){
				SimulationManager.attachRDT( event_data.name, simulation_id, spec);
				for(var i=0;i<files.length;i++){
					
					uploadFile(files[i],location + '/');
				}
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