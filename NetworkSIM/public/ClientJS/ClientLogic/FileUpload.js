var current_files=[];

var uploadEvent={};

function handleFiles(file_type) {
		
		current_files = document.getElementById(file_type).files;		
		readFiles();
		updateData();		

		
}

function updateData(){
	
	var fileBytes = 0,
		nFiles = current_files.length;
		
		var fileSize;

		var thediv = "<table>"
		for (var nFileId = 0; nFileId < nFiles; nFileId++) {
			fileSize=current_files[nFileId].size;
			fileBytes += fileSize;

			var ext= current_files[nFileId].name.split('.').pop();
			var img;

			switch (ext){
				case "js":
					img='../img/js-128.png'
					break;
				default:
					img='../img/html-128.png';
					break
			}
			

			 thediv +="<tr id='FILE"+nFileId+
			"'> <td> <img src='"+img+"' height='128' width='128'/> </td> <td> "+
			current_files[nFileId].name+"</td> <td> Size: "+fileSize+" Bytes" +
					"</td> </tr>";
			

			

		}
		 thediv +=" </table> ";
		 document.getElementById("Files").innerHTML = thediv;
		var fileSize = fileBytes + " bytes";

		document.getElementById("fileNum").innerHTML = nFiles;
		document.getElementById("fileSize").innerHTML = fileSize;
}

function DeleteFile(int){
		
		//
		//delete current_files[int];
		//console.log(current_files);
		//uploadEvent.files = uploadEvent.files.splice(int, 1);
		
	 updateData();
}

function readFiles(){
	for(var i=0;i<current_files.length;i++) { 
		uploadEvent= {name : '', simulation_id:'', spec : '', type : '',  files: []};
		setup_reader(current_files[i]); 
	}
}
function setup_reader(file){
	
	fileReader = new FileReader();
	var name=file.name;
	var type = file.type;
		
	fileReader.onload=function(){
		addFileToEvent(this,type ,name);
	};
	fileReader.readAsText(file);
		 
}

function hasRequiredFile(needle, haystack){
	var bool = false;
	for (var i = 0; i < haystack.length; i++){
		if(haystack[i]['name'] == needle){
			if(needle == 'package.json'){
				uploadEvent.name = JSON.parse(haystack[i]['data']).name;
				uploadEvent.spec = JSON.stringify(haystack[i]['data']);
			}
			bool = true;
			break;
		}
	}
	return bool;
}


function addFileToEvent(filereader,type,name){
	var theFile = {};
	theFile.type=type;
	theFile.data=filereader.result;
	theFile.name=name;
	uploadEvent.files.push(theFile);
	
}
function pushFileEvent(file_type){
	var local_simulation = get_local_simulation();
	uploadEvent.simulation_id = local_simulation._id;
	uploadEvent.type = file_type;
	var upload = true;
	
	if( file_type == 'RDT'){
		if(hasRequiredFile('spec.md', uploadEvent.files) == false){
			alert("Please include a Mark Down file for the specs");
			upload = false;
		}
		if( hasRequiredFile('package.json', uploadEvent.files) == false ){
			alert("Please include a package.json file describing your RDT");
			upload = false;
		}
	}
	if( file_type == 'App'){
		if( hasRequiredFile('package.json', uploadEvent.files) == false ){
			alert("Please include a package.json file describing your Application");
			upload = false;
		}
	}
	if( file_type == 'Test'){
		if( hasRequiredFile('test.json', uploadEvent.files) == false ){
			alert("Please include a test.json file for your Test Script");
			upload = false;
		}
	}
	if( upload){
		console.log(uploadEvent);
		addToEventQueue('/upload',uploadEvent,new Date());
		setTimeout(function(){
			syncWithServer();
			SimulationManagementView();
		},5000);
	}
	
	//
}