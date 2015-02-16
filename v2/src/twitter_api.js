var $ = require('jquery');

module.exports = TwitterApi = {
  // Wraps up querying the server-side proxy, which
  // is for working around CORS restrictions in the browser.
  request: function(method, endpoint, params) {
    return $.ajax({
      url: '/proxy',
      data: {
        method: method,
        endpoint: endpoint,
        params: params
      }
    })
  },

  friendIds: function(username, limit) {
    return TwitterApi.request('get', 'friends/ids', {
      screen_name: 'krob',
      count: limit
    });
  },

  usersLookup: function(userIds) {
    return TwitterApi.request('get', 'users/lookup', {
      user_id: userIds.join()
    });
  },

  searchTweets: function(query) {
    return TwitterApi.request('get', 'search/tweets', {
      q: query,
      result_type: 'mixed'
    });
  }
};