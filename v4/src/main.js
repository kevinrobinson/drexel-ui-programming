/*
This is the main module for browserify.  This is where our JavaScript
program will start.

The full sequence of how this happens is:
  1. Download HTML
  2. See the tag for <script src="dist/bundle.js"></script>
  3. Request that script file from the server and download it.
  4. Run that script.
  5. Browserify has created that script so that it will start
     running the code here.
*/


// Pull in some dependencies.
var $ = require('jquery');
var SearchComponent = require('./search_component');


// Define the starting point for the JavaScript application
function go() {
  var searchComponent = new SearchComponent(document.querySelector('.content'));
  searchComponent.start();
}


// Register with the browser that we want to wait until the HTML document
// has been fully downloaded and is `ready`.  When it is, call the `go`
// function to start the JavaScript application.
$(document).ready(go);
