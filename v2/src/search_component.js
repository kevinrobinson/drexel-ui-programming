var _ = require('lodash');
var merge = function(prev, next) {
  return _.extend({}, prev, next);
};

// Wraps up querying the server-side proxy, which
// is for working around CORS restrictions in the browser.
function twitterApi(method, endpoint, params) {
  return $.ajax({
    url: '/proxy',
    data: {
      method: method,
      endpoint: endpoint,
      params: params
    }
  })
};

function friendIds(username, limit) {
  return twitterApi('get', 'friends/ids', {
    screen_name: 'krob',
    count: limit
  });
}

function usersLookup(userIds) {
  return twitterApi('get', 'users/lookup', {
    user_id: userIds.join()
  });
}

function searchTweets(query) {
  return twitterApi('get', 'search/tweets', {
    q: query,
    result_type: 'popular'
  });
}



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
      searchText: 'kanye',
      tweets: []
    };
  },

  // Start it up!
  start: function() {
    this.bindEvents();
    this.render();
  },

  // Set up any listeners for UI interactions
  // This listens for the user clicking on 'search'
  bindEvents: function() {
    $(this.node).on('click', 'button.search', this.onSearchClicked.bind(this));
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
  onSearchClicked: function() {
    var searchText = $(this.node).find('input.search').val();
    this.setState({ searchText: searchText });
    this.searchAndUpdateState();
  },

  // Perform a server request and set up the handler when the response comes
  // back.
  searchAndUpdateState: function() {
    searchTweets(this.state.searchText).then(this.onServerResponse.bind(this));
  },

  // Handle the server response.
  onServerResponse: function(response) {
    this.setState({ tweets: response.statuses });
  },

  // This is the main function taking the representation of `state`
  // and rendering it as HTML for the user to interact with.
  render: function() {
    // Render HTML and put it in the DOM.
    var htmlPieces = [
      '<input class="search" type="text" value="' + this.state.searchText + '"/>',
      '<button class="search">search</button>',
      this.renderTweetsHtml(this.state.tweets)
    ];
    this.node.innerHTML = htmlPieces.join('');

    // Apply some decoration to make Tweets more interactive.
    // This is idempotent.
    this.decorateTweets();
  },

  // This reaches out to the template stored on the DOM, which isn't ideal.
  // A build system can help move this out of the DOM and into a compile-time
  // step.
  renderTweetsHtml: function(tweets) {
    var tweetTemplateText = $('#tweet-template').text();
    var compiledTweetTemplate = _.template(tweetTemplateText);
    return tweets.map(function(tweet) {
      return compiledTweetTemplate({
        user: tweet.user,
        tweet: tweet
      });
    }).join('');
  },

  // This isn't ideal, reaching out to the global `window` object,
  // but this is common with third-party widgets.
  decorateTweets: function() {
    window.twttr.widgets.load();
  }
};


module.exports = SearchComponent;