// Require some dependencies
var express = require('express');
var moment = require('moment');
var _ = require('lodash');


// Initialize the app and add logging
var app = express();
var logger = require('morgan');
app.use(logger('dev'));


// Add middleware that will parse application/json
// request bodies.
var bodyParser = require('body-parser');
app.use(bodyParser.json());


// This will serve any files in `/public` as-is.
app.use(express.static(__dirname + '/public'));


// This is a map in the server's memory.  It will hold information
// about all the songs in our system.
// In a complete application, this data would be stored in a database
// or another external service.
var allSongsOnServer = {};


// Handle `GET` requests when the request is asking for all of the
// songs.
app.get('/songs', function(req, res){
	// In a complete application, this might read from
	// a database or some other service.
	// Here we just read from a map that is stored in memory
	// on the server, and unroll it from a map to a list.
	var songs = _.values(allSongsOnServer);

	// Send back all songs in the response, and then signal that
	// the response is done.
	res.json({ songs: songs });
	res.end();
});


// Handle `POST` requests when the request is sending up a new song.
// Store them in a map in the server's memory.
app.post('/songs', function(req, res){
	// Read request body.  The 'body-parser' middleware above
	// will handle parsing it as JSON.
	var song = req.body;

	// Add a unique id to the song, so we can refer to it later.
	// This is something a database or storage service will usually
	// do for you, so this is just a minimal example to get started.
	song.id = _.uniqueId();

	// Add this to our map holding all the songs.
	allSongsOnServer[song.id] = song;

	// Send back a response so that the client knows everything
	// was successful.  The `201` status code means "Successfull created."
	res.status(201);
	res.json(song);
	res.end();
});


// Handle `GET` requests when the request is asking for a
// specific song.
app.get('/songs/:id', function(req, res){
	// Read the request parameters.  In this case, we grab the
	// `id` from the request path so we can use it
	// to lookup the `song` that the request is asking for.
	var songId = req.params.id;

	// In a complete application, this might read from
	// a database or some other service.
	// Here we just read from a map that is stored in memory
	// on the server.
	var song = allSongsOnServer[songId];

	// If we couldn't find that song in the map in memory,
	// then return a response with a 404 status code, which means
	// 'not found'
	if (!song) {
		console.warn('Could not find song with id:', songId);
		return res.status(404).end();
	}

	// Send back the song in the response, and then signal that
	// the response is done.
	res.json(song);
	res.end();
});


// Start the server
var server = app.listen(3018, function() {
  console.log('Listening on port %d', server.address().port);
});
