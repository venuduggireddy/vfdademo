// set variables for environment
var express = require('express');
var app = express();
var path = require('path');
var request = require('request');

// set routes
app.get("/", function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
  

app.get('/search', function(req, res) {
  //res.send('hello open fda');
   var q = req.query.q;
   console.log("Search Query is %s", q);
   // request module is used to process the yql url and return the results in JSON format
   var url = 'https://api.fda.gov/drug/event.json?search=patient.drug.openfda.pharm_class_epc:"nonsteroidal+anti-inflammatory+drug"&count=patient.reaction.reactionmeddrapt.exact';
   request(url, function(err, resp, body) {
     body = JSON.parse(body);
     res.send(body);
   });
});

// Set server port
app.listen(4000);
console.log('server is running');