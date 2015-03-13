//var util=require("../public/ClientJS/Utilities.js");
var Util=require("../../Utilities/utilities.js");

function deepCopyTest(){

	var stupidObject={
			name: 'test',
			vv:2,
			a_list:[2,3,4
			],
			another_list:[
				{name:'a'},{name:'b'},{name:'c'}
			]
		};

	var newObject=Util.deepCopy(stupidObject);

		stupidObject.vv=4;
		newObject.another_list[0].name="changed";
		stupidObject.a_list[1]='59';


		var linked = stupidObject.vv===newObject.vv||stupidObject.another_list[0]===newObject.another_list[0]||stupidObject.a_list[1]===newObject.a_list[1];

}


deepCopyTest();