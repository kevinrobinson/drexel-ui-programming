var _ = require('lodash');
var $ = require('jquery');
var songsTemplate = require('./songs.tpl');
var formTemplate = require('./new_song_form.tpl');


var merge = function(prev, next) {
  return _.extend({}, prev, next);
};


// This is a minimal component class.  It's similar to what you
// would find in a React component or Backbone.View, but a little bit
// more minimal and explicit so you can see how it works.
//
// This is the constructor, and the methods are defined below.
// While JavaScript has more flexibility than Java, this is essentially
// the same as a Java class.
var AppComponent = function(node) {
  this.node = node;
  this.state = this.initialState();
};


// `state` and `render` are the important pieces here.
//
// `state` describes the information in the component, and `render`
// translates that into the DOM in the browser.
//
// Everything else here is supporting those two pieces.
//
// This component is starting to get a little too large, and do too
// many things, so in a production application, we'd probably look at
// breaking this up a bit more as a next step.
AppComponent.prototype = {
  /* CORE COMPONENT METHODS */
  // Define the initial state of the component
  initialState: function() {
    return {
      isAddingNewSong: false,
      songs: []
    };
  },

  // Start it up!
  start: function() {
    this.bindEvents();
    this.render();
    this.doRequestSongsAndUpdateState();
  },

  // Set up any listeners for UI interactions
  bindEvents: function() {
    // Form for adding a new song
    $(this.node).on('click', 'button.add-song', this.onAddSongClicked.bind(this));
    $(this.node).on('click', '.new-song a.close-tab', this.onNewSongClose.bind(this));
    $(this.node).on('click', '.new-song button.save-new-song', this.onSaveClicked.bind(this));
  },

  // Update the current state of the component in memory.
  // After updating the state, re-render so that the DOM
  // shows the new state.
  // This is where view-layer optimizations happen.
  setState: function(newState) {
    this.state = merge(this.state, newState);
    this.render();
  },


  /* ACTION AND TRANSITION METHODS */
  // Make a server request for all the songs, and register
  // a handler to update `state` when we get a response back
  // from the server.
  //
  // See http://api.jquery.com/jquery.ajax/ for more details on
  // `$.ajax` and how it works.
  doRequestSongsAndUpdateState: function() {
    $.ajax('/songs').then(this.onSongsRequestCompleted.bind(this));
  },

  // This reads in the information that the user has entered into
  // the form, and returns it as a plain JavaScript map.
  readSongFromForm: function() {
    var $formNode = $(this.node).find('.new-song');
    return {
      title: $formNode.find('input.title').val(),
      youTubeId: $formNode.find('input.youtube-id').val(),
      source: $formNode.find('input.source').val(),
      text: $formNode.find('input.tab').val()
    };
  },

  // This makes a server request to POST the new song to the server
  // and save it.
  postNewSong: function(newSong) {
    return $.ajax({
      method: 'post',
      url: '/songs',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(newSong)
    });
  },


  /* EVENT HANDLERS */
  // Handle the server response.  When the response comes back,
  // update `state` with the new list of songs.
  onSongsRequestCompleted: function(response) {
    this.setState({ songs: response.songs });
  },

  onAddSongClicked: function(event) {
    event.preventDefault();
    this.setState({ isAddingNewSong: true });
  },

  onNewSongClose: function(event) {
    event.preventDefault();
    this.setState({ isAddingNewSong: false });
  },

  // When the user clicks on the `save` button, read in what
  // they typed in the form, and then save it to the server.
  // Also add the new song to `state` so the user can see it in the UI.
  // Failures aren't handled in this code here, this is an important detail
  // but beyond the scope of this project.
  onSaveClicked: function(event) {
    event.preventDefault();

    // Read what the user entered into the form.
    // This is where we might add validation to make sure what
    // they entered makes sense (that's not done here).
    var newSong = this.readSongFromForm();
    // Don't update the state until we receive a response from the server.
    // Here would be a good place to add some feedback to the user regarding server communication (i.e. spinning wheel)

    // Make a request to post the new song to the server.
    // When it's done, then update the UI so we're not adding
    // a new song anymore.
    this.postNewSong(newSong).then(this.onNewSongSaved.bind(this));
    // Optional:
    // To handle the case of a failure communicating with the server, instead of .then() you can register .done() and .fail() callbacks.
    // Documentation here:
    // http://api.jquery.com/category/deferred-object/
  },

  onNewSongSaved: function(newSong) {
    // Update the state with the response from the server.
    var updatedSongs = this.state.songs.concat(newSong);
    this.setState({ isAddingNewSong: false, songs: updatedSongs });
  },


  /* RENDERING CODE */
  // This is the main function taking the representation of `state`
  // and rendering it as HTML for the user to interact with.
  render: function() {
    // Translate the data in `state` to a string of HTML for the
    // user interface.
    var htmlPieces = [];
    if (this.state.isAddingNewSong) {
      var formHtml = formTemplate();
      htmlPieces.push(formHtml);
    } else {
      songsListHtml = this.renderSongsHtml(this.state.songs);
      htmlPieces.push(songsListHtml);
    }

    // Put the HTML on the page in the browser.
    this.node.innerHTML = htmlPieces.join('');

    // Also focus the cursor on the first input element.
    $(this.node).find('input:first').focus();
  },

  // This will also render youTubeIds as embedded videos, so
  // the user can listen to the song while reading the music.
  // See https://developers.google.com/youtube/player_parameters
  // for more details if you're curious about how this works.
  renderSongsHtml: function(songs) {
    return songsTemplate({ songs: songs });
  }
};


module.exports = AppComponent;