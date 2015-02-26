									-- Group 2 README --

->To run our code:

	Our server may be access from http://sc-2.cs.mun.ca/
	-from this page a user may view the simulations available on this application in the "Simulation" tab, and create new simulations with the "new simulation" button. 
	-after each operation, such as "new simulation" press the sync with server button in order to send changes and recieve changes from the server
	-Pressing "new simulation" allows you to create a new simulation. 
	-for "token propagation method" the only currently supported method is "email" which must be entered in the token propagation method field
	-once your simulation has been created, you must press "sync with server" in order to attain the new simulation synced up with the server. This will
	be updated in the next itteration in order to allow a simulation.
	-In the list of "simulations" you may  press "register" by any of the simulations and you will be prompted to enter a token which would have been
	mailed to you if you were one of the devices allowed in the simulation creation.
    
    -The 'Temporary GUI View' tab shows what the simulation will look like when taking in a particular "config map" or state of our system
    although this is not integrated with the actual simulation, it contains all methods to do so, and will be an initial focus of next iteration.
   
	-The 'Temporary Event Logs View' tab shows what viewing the event logs of a simulation will look like. It has all the necessary methods to be 
    implemented into the simulation, and takes in a 'states' object, the object encoding each state of our simulation, although we haven't put
    implemented retrieving the actual logs, this will be an initial focus of the next iteration.
    -> Press on a timestamp to view the simulation snapshot of that time
    -> press on a device object in the GUI of the simulation snapshot to view the events for that device
    
    * Please note that our counter is still active within our project code. We made an error in telling Dr. Fiech that it does not in the presentation.
      Feel free to test this. 