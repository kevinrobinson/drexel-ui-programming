var _ = require('lodash');
var $ = require('jquery');
var songsTemplate = require('./songs.tpl');
var tabTemplate = require('./tab.tpl');
var formTemplate = require('./new_song_form.tpl');


var merge = function(prev, next) {
  return _.extend({}, prev, next);
};


// This is a minimal component class.  It's similar to what you
// would find in a React component or Backbone.View.
//
// This is the constructor, and the methods are defined below.
// While JavaScript has more flexibility than Java, this is essentially
// the same as a Java class.
var SearchComponent = function(node) {
  this.node = node;
  this.state = this.initialState();
};


// `state` and `render` are the important pieces here.
//
// `state` describes the information in the component, and `render`
// translates that into the DOM in the browser.
//
// Everything else here is supporting those two pieces.
SearchComponent.prototype = {
  // Define the initial state of the component
  initialState: function() {
    return {
      isLoading: false,
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
  // This listens for the user clicking on 'search'
  bindEvents: function() {
    $(this.node).on('click', 'a.song', this.onSongClicked.bind(this));
    $(this.node).on('click', '.add-song', this.onAddSongClicked.bind(this));

    // tab
    $(this.node).on('click', '.song-tab a.close-tab', this.onCloseTab.bind(this));

    // new song form
    $(this.node).on('click', '.new-song a.close-tab', this.onCloseNewSong.bind(this));
    $(this.node).on('click', '.new-song .save-new-song', this.onSaveNewSong.bind(this));
  },

  // Update the current state of the component in memory.
  // After updating the state, re-render so that the DOM
  // shows the new state.
  // This is where view-layer optimizations happen.
  setState: function(newState) {
    this.state = merge(this.state, newState);
    this.render();
  },

  // When user interaction occurs, read what they did and
  // update the state.  Then peform a server request based on that
  // new state.
  // onSearchClicked: function() {
  //   var searchText = $(this.node).find('input.search').val();
  //   this.setState({ searchText: searchText });
  //   this.searchAndUpdateState();
  // },

  // Perform a server request and set up the handler when the response comes
  // back.
  // searchAndUpdateState: function() {
  //   this.setState({ isLoading: true });
  //   TwitterApi.searchTweets(this.state.searchText)
  //     .then(this.onServerResponse.bind(this));
  // },

  doRequestSongsAndUpdateState: function() {
    this.setState({ isLoading: true });
    $.ajax('/songs').then(this.onServerResponse.bind(this));
  },

  doShowSongTab: function(song) {
    var tabHtml = tabTemplate({ song: song });
    $(this.node).find('.songs').hide();
    $(this.node).append(tabHtml);
  },

  doHideSongTab: function() {
    $(this.node).find('.song-tab').remove();
    $(this.node).find('.songs').show();
  },

  doShowNewSongForm: function() {
    var formHtml = formTemplate();
    $(this.node).find('.songs').hide();
    $(this.node).append(formHtml);
  },

  doHideNewSongForm: function() {
    $(this.node).find('.new-song').remove()
    $(this.node).find('.songs').show();
  },

  readSongFromForm: function() {
    return {
      title: 'title',
      artist: 'artist',
      youTubeId: 'bar',
      source: 'foo',
      text: 'text'
    };
  },




  // Handle the server response.
  onServerResponse: function(response) {
    this.setState({
      isLoading: false,
      songs: response.songs
    });
  },

  onSongClicked: function(e) {
    e.preventDefault();

    var songId = $(e.currentTarget).data('song-id');
    var song = _.find(this.state.songs, function(song) { return song.id.toString() === songId.toString(); });
    this.doShowSongTab(song);
  },

  onAddSongClicked: function(e) {
    e.preventDefault();
    this.doShowNewSongForm();
  },

  onCloseTab: function(e) {
    e.preventDefault();
    this.doHideSongTab();
  },

  onCloseNewSong: function(e) {
    e.preventDefault();
    this.doHideNewSongForm();
  },

  onSaveNewSong: function(e) {
    var newSong = this.readSongFromForm();

    $.ajax({
      method: 'post',
      url: '/songs',
      data: newSong
    });
  },

  // This is the main function taking the representation of `state`
  // and rendering it as HTML for the user to interact with.
  render: function() {
    // Render HTML and put it in the DOM.
    var htmlPieces = [
      // '<input class="search" type="text" value="' + this.state.searchText + '"/>',
      // '<button class="search">search</button>',
      this.renderLoadingState(),
      this.renderSongsHtml(this.state.songs)
    ];
    this.node.innerHTML = htmlPieces.join('');
  },

  renderLoadingState: function() {
    return (this.state.isLoading)
      ? '<div class="loading">Here they come...</div>' : '';
  },

  // This reaches out to the template stored on the DOM, which isn't ideal.
  // A build system can help move this out of the DOM and into a compile-time
  // step.
  renderSongsHtml: function(songs) {
    return songsTemplate({ songs: songs });
    // var tweetTemplateText = $('#tweet-template').text();
    // var compiledTweetTemplate = _.template(tweetTemplateText);
    // return tweets.map(function(tweet) {
    //   return compiledTweetTemplate({
    //     user: tweet.user,
    //     tweet: tweet
    //   });
    // }).join('');
  }
};


module.exports = SearchComponent;