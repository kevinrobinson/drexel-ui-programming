var $ = require('jquery');
var SearchComponent = require('./search_component');

// This is the Main module
// Wait for the document to load.
// And also wait for the Twitter widget renderer to load.
$(document).ready(function() {
  window.twttr.ready(function() {
    var searchComponent = new SearchComponent(document.querySelector('.content'));
    searchComponent.start();
  });
});
