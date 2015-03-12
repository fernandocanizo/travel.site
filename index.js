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

// no need to provide crackers with extra info
app.disable('x-powered-by');

// set up handlebars view engine
var handlebars = require('express-handlebars');

app.engine('handlebars', handlebars({
	defaultLayout: 'main',
	helpers: {
		section: function (name, options) {
			if(! this._sections) {
				this._sections = {};
			}

			this._sections[name] = options.fn(this);
			return null;
		}
	}
}));

app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || tsDefaults.port);


////////////////////////////////////////////////////////////////////////////////
// middleware
////////////////////////////////////////////////////////////////////////////////

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
	res.locals.showTests = app.get('env') === 'development' && req.query.test;
	next();
});

app.use(function (req, res, next) {
	var weather = require('./lib/weather');

	if(! res.locals.partials) {
		res.locals.partials = {};
	}

	res.locals.partials.weather = weather.get();

	next();
});

////////////////////////////////////////////////////////////////////////////////
// routes
////////////////////////////////////////////////////////////////////////////////
app.get('/', function (req, res) {
	res.render("home");
});

app.get('/check-jquery', function (req, res) {
	res.render('check-jquery');
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


app.get('/tours/oregon-coast', function (req, res) {
	res.render('tours/oregon-coast');
});


app.get('/tours/request-group-rate', function (req, res) {
	res.render('tours/request-group-rate');
});


app.use(function (req, res) {
	// custom 404 page
	res.status(404)
		.render("404");
});


app.use(function (err, req, res, next) {
	// keep this one *last*
	// next is needed by Express to recognize this as an error handler
	console.error(err.stack);
	res.status(500)
		.render("500");
});


app.listen(app.get('port'), function () {
	console.log("App started on http://localhost:" + app.get('port'));
});
