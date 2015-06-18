// set variables for environment
var express = require('express');
var app = express();
var path = require('path');

// set routes
app.get('/', function(req, res) {
  res.render('index');
});

// Set server port
app.listen(4000);
console.log('server is running');