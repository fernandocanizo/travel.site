// Creation Date: 2015.03.28
// Author: Fernando L. Canizo - http://flc.muriandre.com/


// I'll incorporate this when I find the need.

"use strict";

var credentials = require('./credentials.js');
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: credentials.gmail.user,
		pass: credentials.gmail.pass
	}
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
	from: '"God Incorporated" <god@heaven.com>',
	to: 'flc@muriandre.com',
	subject: 'Test from Node.js',
	text: 'This is a test.',
    html: '<b>This is the same test in HTML.</b>'
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
	if(error) {
		console.error(error);
	} else {
		console.log('Message sent: ' + info.response);
	}
});
