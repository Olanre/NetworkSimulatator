var FM=require("../Server/FileManager.js");

var file={
	name:'testfile.js',
	type:'RDT',
	data:"var FM=require('../Server/FileManager.js); var file={ name='testception.txt, type:'APP', data:'The Quick Brown Fox Jumped Over The Lazy Dog'} FM.uploadFile(file,'/');"
}

FM.uploadFile(file,'../apps/');


