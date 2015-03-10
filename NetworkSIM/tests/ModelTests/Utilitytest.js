var util=require("../public/ClientJS/Utilities.js");
var badlist=[{name:'five',children:['test','test2']},{name:'am',children:['test','test2']},{name:'yo',children:['test8','test88']}];
console.log(badlist[0].name);
console.log(badlist[2].children[0]);
var part=util.buildPartition(badlist);
console.log(part);