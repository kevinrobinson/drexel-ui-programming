// Require some dependencies
var config  = require('./config');
var express = require('express');
var moment = require('moment');
var fs = require('fs');


// Initialize the app and add logging
var app = express();
var logger = require('morgan');
app.use(logger('dev'));



// This handle all requests coming in.
// If the request is a GET request, it will try to read
// the files in `/public` into memory synchronously,
// the write the contents back as the response.
//
// Doing this synchronously and buffering the whole file into
// memory is super inefficient, but shows the essential concept.
// app.use(function(req, res, next) {
// 	if (req.method.toLowerCase() === 'get') {
// 		var path = req.originalUrl;
// 		res.write(fs.readFileSync('./public/' + path));
// 		res.end();
// 		return;
// 	}

// 	// This means we couldn't handle this request, see if any other registered
// 	// handlers can handle it.
// 	next();
// });

// This is a more efficient way to serve static files using streams.
app.use(express.static(__dirname + '/public'));



// Example of dynamic content
app.get('/hello', function(req, res){
	// Read request parameters
	var name = req.query.name || 'amigo';

	res.setHeader('Content-Type', 'text/plain');
	res.write('Hello ' + name + '!');
	res.end();
});



// Example of dynamic JSON content
app.get('/birthday', function(req, res){
	// Read query parameters
	var month = req.query.month;
	var day = req.query.day;
	if (!month || !day) {
		res.status(400);
		res.end();
		return;
	}

	// Perform computation
	var now = new Date();
	var daysLeft = moment('2015' + month + day, 'YYYYMMDD').fromNow();

	// Render response
	res.setHeader('Content-Type', 'application/json');
	res.json({
		howMuchLonger: daysLeft,
		nowString: now.toString(),
		nowTimestamp: now.getTime()
	});
	res.end();
});


// Example of using another service to provide dynamic content.
// In this case, we're querying the Twitter API.
// This also serves as a proxy to work around CORS restrictions in the
// browser.

// First, initialize the Twitter client.
var Twitter = require('twit');
var twitter = new Twitter(config);

// Then register an endpoint hander that will use that client.
app.get('/proxy', function(req, res){
	var query = req.query;
	var method = query.method;
	var endpoint = query.endpoint;
	var params = query.params;
	// console.log('/proxy', method, endpoint, params);
	twitter[method](endpoint, params, function(err, data) {
		if (err) {
			console.log('ERROR: ', err, JSON.stringify(err, null, 2));
			res.end();
		}
		var stringifyData = JSON.stringify(data);
		// console.log(' => ', res.statusCode, stringifyData);
		res.setHeader('Content-Type', 'application/json');
		res.write(stringifyData);
		res.end();
	});
});


// Start the server
var server = app.listen(3003, function() {
  console.log('Listening on port %d', server.address().port);
});
