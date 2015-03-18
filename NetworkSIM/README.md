									-- Group 2 README --

---------------------------------
Known issues
-------------------------------
1. Occasionally the server will not display the list of all created simulations. If this happens, please refresh the page, this should fix it.
  The reason this happens is because some of the files are not loaded fast enough, and a function calls a file which does not yet exist. This will be fixed
  in iteration 4.

->To run our code:
	Our server may be access from http://sc-2.cs.mun.ca/
	-from this page a user may view the simulations available on this application in the "Simulation" tab, and create new simulations with the "new simulation" button. 
	-Pressing "new simulation" allows you to create a new simulation. 
	-for "token propagation method" the only currently supported method is "email" which must be entered in the token propagation method field. Currently 
	 the email system may have been marked for spam, which we will handle next iteration, and therefore the tokens are displayed in the console.log as well.
	 ---
	 To view a token, if one was not emailed to you, in our files under the /server/tokens/tokens.txt which contains a token to the newest simulation which you have created.
	 ---
	-In the list of "simulations" you may  press "register" by any of the simulations and you will be prompted to enter a token which would have been
	 mailed to you if you were one of the devices allowed in the simulation creation. As well, you can view the simulations to which you are 
	 registered
	
    -after entering a simulation, you have new choices on the side-bar
    -pressing Network Topology allows you to see a graphical representation of the topology. Move devices between networks, create partitions by dragging one network
    ontop of another, and delete partitions by dragging those networks ontop of eachother again.
    	-if you return to the page, you will see the same topology, although represented slightly differently according to our topology
    	generation algorithm, this is to handle changes having happened on other devices and ensure that the topology remains uniform throughout
    
	-The 'Simulation History' tab shows the current history of the simulation. Pressing on a date on the right side bar will display the simulation at that date. 
	 From there, you can view all of the events which have occurred up to this point in the box, and pressing on a device will show you all of the events (interactions with
	 RDTs and applications as specified by Dr. Fiech) which have occured on this device up to this point.
	-Pressing the My device button takes you to a page where you can get information on the device which you own, see your applications and RDTS, create networks, and move 
	 between networks.
	 
	 Applications and RDTS 
	On the server ApplicationManager and RDTManager take care of calls for apps and  rdts respectively. This includes manipulating an RDT, deploying apps, launching an app and importing an rdt.

	To import apps there is one in our tests folder under the folder testapp. Import all the files in that folder. 
	To import rdts, there are two in our tests folder under testrdts. Each of the files in rdt1 and rdt2 should be imported. so to import the first rdt, import the files in rdt1, and to import the second rdt, import the files in rdt2. 

	All rdts need a package.json and spec.md as explained in the framework.  The RDT’s Rio provided us uses several files such as the rdtinterface, counter, spec.md and package.json. The rdt1 and 2 have similar files. All of which should be imported. 

	So again for Apps
	Go to our Working Directory of the Project called NetworkSim/tests/testapp

	For RDTS 
	Go to our Working Directory of the Project called NetworkSim/tests/testrdts/rdt1
	and to NetworkSim/tests/testrdts/rdt2
	