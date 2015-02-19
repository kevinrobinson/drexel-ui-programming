/*
This is the main module for browserify.  This is where our JavaScript
program will start.

The full sequence of how this happens in the browser is that the browser:
  1. Downloads the HTML file
  2. Sees the tag for <script src="dist/bundle.js"></script>
  3. Requests that script file from the server and downloads it.
  4. Runs that script.
  5. The way that browserify has bundled up the JavaScript means
     that the JavaScript program starts running here.
*/


// Pull in some dependencies.
var $ = require('jquery');
var AppComponent = require('./app_component');


// Define the starting point for the JavaScript application
function startApplication() {
  var appComponent = new AppComponent(document.querySelector('.content'));
  appComponent.start();
}


// Register with the browser that we want to wait until the HTML document
// has been fully downloaded and is `ready`.  When it is, call the `startApplication`
// function to start the JavaScript application.
$(document).ready(startApplication);
