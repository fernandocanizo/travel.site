// Creation Date: 2015.03.06
// Author: Fernando L. Canizo - http://flc.muriandre.com/

"use strict";

// hard coded defaults for this application
// some of them may be overriden with environment variables
var tsDefaults = {
	port: 80
};


var credentials = require('./credentials.js');
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

switch(app.get('env')) {
	case 'development':
		app.use(require('morgan')('dev'));
		break;

	case 'production':
		app.use(require('express-logger')({
			path: __dirname + '/log/requests.log'
		}));
		break;
}


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

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

app.use(function (req, res, next) {
	// if there's a flash message, transfer it to the context, then clear it
	res.locals.flash = req.session.flash;
	delete req.session.flash;
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


app.get('/newsletter', function (req, res) {
	// TODO CSRF
	res.render('newsletter', {csrf: "Cross Site Request Forgery token goes here"});
});


app.post('/newsletter', function (req, res) {
	var name = req.body.name || '';
	var email = req.body.email || '';

	// input validation
	if(! email.match(VALID_EMAIL_REGEXP)) {
		if(req.xhr) {
			return res.json({error: "Invalid email address."});
		}

		req.session.flash = {
			type: "danger",
			intro: "Validation error!",
			message: "The email address you entered wasn't valid."
		};

		return res.redirect(303, '/newsletter/archive');
	}

	new NewsLetterSignup({name: name, email: email}).save(function (err) {
		if(err) {
			if(req.xhr) {
				return res.json({error: "Database error."});
			}

			req.session.flash = {
				type: "danger",
				intro: "Database error!",
				message: "There was a database error. Please try again later."
			};

			return res.redirect(303, '/newsletter/archive');
		}

		if(req.xhr) {
			return res.json({success: true});
		}

		req.session.flash = {
			type: "success",
			intro: "Thank you!",
			message: "You've been signed up for our newsletter."
		};

		return res.redirect(303, '/newsletter/archive');
	});
});

app.post('/process', function (req, res) {
	if(req.xhr || 'json' === req.accepts('json,html')) {
		res.json({
			status: true,
			statusMessage: "You're now registered to our newsletter",
		});

	} else {
		res.redirect(303, '/thank-you');
	}
});


app.get('/contest/vacation-photo', function (req, res) {
	var now = new Date();
	var month = now.getMonth() + 1;

	res.render('contest/vacation-photo', {
		year: now.getFullYear(),
		month: (month < 10)? '0' + month : month
	});
});


app.get('/thank-you', function (req, res) {
	res.render('thank-you');
});


app.post('/contest/vacation-photo/:year/:month', function (req, res) {
	var formidable = require('formidable');
	var form = new formidable.IncomingForm();

	form.parse(req, function (err, fields, files) {
		if(err) {
			return res.redirect(303, '/error');
		}

		console.log("Received fields:", fields);
		console.log("Received files:", files);

		res.redirect(303, '/thank-you');
	});
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
	console.log("Express started in " + app.get('env') + " mode. Listening on http://localhost:" + app.get('port'));
});
