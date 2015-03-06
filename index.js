// Creation Date: 2015.03.06
// Author: Fernando L. Canizo - http://flc.muriandre.com/

"use strict";

// hard coded defaults for this application
// some of them may be overriden with environment variables
var tsDefaults = {
	port: 3000
};


var express = require('express');

var app = express();

app.set('port', process.env.TRAVEL_SITE_PORT || tsDefaults.port);


// custom 404 page
app.use(function (req, res) {
	res.type("text/plain");
	res.status(404);
	res.send("404 - Page not found");
});


// custom 500 page
app.use(function (req, res) {
	res.type("text/plain");
	res.status(500);
	res.send("500 - Internal server error");
});


app.listen(app.get('port'), function () {
	console.log("App started on http://localhost:" + app.get('port'));
});
