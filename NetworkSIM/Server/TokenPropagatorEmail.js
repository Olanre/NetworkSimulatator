/*****
The purpose of this class is to send tokens to devices and store these tokens in the database.
The email is sent through our gmail account
password is biggroup2
username cs4770group2@gmail.com
@author Noah
******/

var nodemailer = require('nodemailer');

function mailToken(email, token, sim_name){
	var transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	        user: 'team24770@gmail.com',
	        pass: 'fiechclass'
	    }
	});
	transporter.sendMail({
	    from: 'team24770@gmail.com',
	    to: email,
	    subject: 'Simulation Framework Registration',
	    text: 'Your token is: ' + token + '  Use it to Register for Simulation: ' + sim_name
	});
}

exports.mailToken=mailToken;
