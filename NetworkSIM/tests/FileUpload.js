var current_rdtfiles=[];
var current_appfiles=[];
var uploadEvent={simulation_id:'', files: []};

			function handleFiles() {

				current_rdtfiles = document.getElementById("uploadRDT").files;
				current_appfiles = document.getElementById("uploadApp").files;

				var appBytes = 0,
				rdtBytes=0;
				nRDTs = current_rdtfiles.length,
				nApps = current_appfiles.length;


				for (var nFileId = 0; nFileId < nRDTs; nFileId++) {
					rdtBytes += current_rdtfiles[nFileId].size;
				}
				for (var nFileId = 0; nFileId < nApps; nFileId++) {
					appBytes += current_appfiles[nFileId].size;
				}


				var rdtSize = rdtBytes + " bytes";
				var appSize = appBytes + " bytes";

				document.getElementById("rdtfileNum").innerHTML = nRDTs;
				document.getElementById("rdtfileSize").innerHTML = rdtSize;

				document.getElementById("appfileNum").innerHTML = nApps;
				document.getElementById("appfileSize").innerHTML = appSize;
		}

		function readFiles(){
			var rdtReaders=[];
			var appReaders=[];
			var file;
			for(var i=0;i<current_rdtfiles.length;i++){
				rdtReaders.push(new FileReader());

				rdtReaders[i].onload=function(){
					addFileToEvent(this,'APP');
				};

				rdtReaders[i].readAsText(current_rdtfiles.item(i));
			}
			for(var i=0;i<current_appfiles.length;i++){
				appReaders.push(new FileReader());
				console.log(current_rdtfiles);
				appReaders[i].onload=function(){
					addFileToEvent(this,'APP');
				};

				appReaders[i].readAsText(current_appfiles.item(i));
			}
		}

		function addFileToEvent(filereader,type){
			var theFile = {};
			theFile.type=type;
			theFile.data=filereader.result;
			uploadEvent.files.push(theFile);
			console.log(uploadEvent);
		}