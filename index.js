// Creation Date: 2015.03.06
// Author: Fernando L. Canizo - http://flc.muriandre.com/

"use strict";

// hard coded defaults for this application
// some of them may be overriden with environment variables
var tsDefaults = {
	port: 80
};


var express = require('express');

var app = express();

////////////////////////////////////////////////////////////////////////////////
// configuration
////////////////////////////////////////////////////////////////////////////////

// set up handlebars view engine
var handlebars = require('express-handlebars');

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || tsDefaults.port);


////////////////////////////////////////////////////////////////////////////////
// routes
////////////////////////////////////////////////////////////////////////////////

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
	res.locals.showTests = app.get('env') === 'development' && req.query.test;
	next();
});

app.get('/', function (req, res) {
	res.render("home");
});


app.get('/about', function (req, res) {
	var fortune = require('./lib/get.fortune');

	fortune.get(function (fortune) {
		res.render("about", {fortune: fortune, pageTestScript: '/qa/test.about.js'});
	});
});


app.get('/tours/hood-river', function (req, res) {
	res.render('tours/hood-river');
});


app.get('/tours/request-group-rate', function (req, res) {
	res.render('tours/request-group-rate');
});


app.use(function (req, res) {
	// custom 404 page
	res.status(404);
	res.render("404");
});


app.use(function (req, res) {
	// custom 500 page
	res.status(500);
	res.render("500");
});


app.listen(app.get('port'), function () {
	console.log("App started on http://localhost:" + app.get('port'));
});
