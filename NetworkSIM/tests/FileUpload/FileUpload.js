var current_rdtfiles=[];
var current_appfiles=[];
var uploadEvent={simulation_id:'', files: []};

			function handleFiles() {

				current_rdtfiles = document.getElementById("uploadRDT").files;
				current_appfiles = document.getElementById("uploadApp").files;

				updateData();

				
		}

		function updateData(){
			document.getElementById("rdtFiles").innerHTML='';
			var appBytes = 0,
				rdtBytes=0;
				nRDTs = current_rdtfiles.length,
				nApps = current_appfiles.length;
				var fileSize;

				for (var nFileId = 0; nFileId < nRDTs; nFileId++) {
					fileSize=current_rdtfiles[nFileId].size;
					rdtBytes += fileSize;

					var thediv ="<div id='RDT"+nFileId+
					"'><img src='js-128.png' height='128' width='128'/><br> "+
					current_rdtfiles[nFileId].name+"<br> Size: "+fileSize+" Bytes</div>";


					document.getElementById("rdtFiles").innerHTML+=thediv;
				}

				for (var nFileId = 0; nFileId < nApps; nFileId++) {
					fileSize=current_appfiles[nFileId].size;
					appBytes += fileSize;

					var ext= current_appfiles[nFileId].name.split('.').pop();
					var img;

					switch (ext){
						case "js":
							img='js-128.png'
							break;
						default:
							img='html-128.png';
							break
					}

					var thediv ="<div id='APP"+nFileId+
					"'><img src='"+img+"' height='128' width='128'/><br> "+
					current_appfiles[nFileId].name+"<br> Size: "+fileSize+" Bytes</div>";


					document.getElementById("appFiles").innerHTML+=thediv;

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
				var name=current_rdtfiles.item(i).name;
				rdtReaders[i].onload=function(){
					addFileToEvent(this,'APP',name);
				};
				rdtReaders[i].readAsText(current_rdtfiles.item(i));
			}
			for(var i=0;i<current_appfiles.length;i++){
				appReaders.push(new FileReader());
				var name=current_appfiles.item(i).name;

				appReaders[i].onload=function(){
					addFileToEvent(this,'APP',name);
				};

				appReaders[i].readAsText(current_appfiles.item(i));
			}
		}

		function addFileToEvent(filereader,type,name){
			var theFile = {};
			theFile.type=type;
			theFile.data=filereader.result;
			theFile.name=name;
			uploadEvent.files.push(theFile);
			console.log(uploadEvent);
		}