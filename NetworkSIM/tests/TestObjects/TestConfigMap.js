var testConfigMap1={
		 'Partition1': 
		 {'networka' :
		 { 'devicea' : '1',  'deviceb@mun.ca': '2', 'devicec@mun.ca':'3'},
		 'networkb' :
		 		{ 'deviced': '4', 'devicee': '5'},
		 				},
		  'Partition2':
		 { 'networkc' :
		 { 'devicef': '6', 'deviceg@mun.ca' : '7',  'deviceh@mun.ca': '8'},
		 'networkd' :
		 		{'devicei@mun.ca':'9', 'device@mun.ca': '10'},
		 		'networkTest':{},
		 				},
		  'Partition3':
		 { 'networke' : { 'devicek':'11'} },
		 'freelist' : {'devicew': '13', 'evicex' : '14'}
		 };
var testConfigMap2={
		 'Partition1': 
		 {'networka' :
		 { 'devicea' : '1',  'deviceb@mun.ca': '2', 'devicec@mun.ca':'3'},
		 'networkb' :{ 'deviced': '1', 'devicee': '2'},
 		'networkc' :{ 'deviced': '1', 'devicee': '2'},
 		'networkd' :{ 'deviced': '1', 'devicee': '2'},
 		'networke' :{ 'deviced': '1', 'devicee': '2'},
		 				},
		 'freelist' : {'devicew': '13', 'evicex' : '14','device1' :'22','device2' :'22','device3' :'22','device4' :'22'}
		 };
var testConfigMap3={
		'Partition1':
		 { 'networka' : { 'deviceA':'11','deviceB':'11','deviceC':'11','deviceD':'11','deviceE':'11'} },
		 'Partition2':
		 { 'networkb' : { 'device':'11'} },
		 'Partition3':
		 { 'networkc' : { 'device':'11'} },
		 'Partition4':
		 { 'networkd' : { 'device':'11'} },
		 'Partition5':
		 { 'networke' : { 'device':'11'} },
		 'freelist':{}
}