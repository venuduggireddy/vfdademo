// set variables for environment
var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var querystring = require('querystring');
var _ = require('lodash-node');
var config = require('./config');

//var fda_api_key = config.api_key;

// set routes
app.get("/", function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
  

app.get('/search', function(req, res) {
  //res.send('hello open fda');
   var q = req.query.q;
   console.log("Search Query is %s", q);
   // request module is used to process the yql url and return the results in JSON format
   var q_str = 'api_key='+config.api_key+'&search=generic_name:'+q;
   console.log('%s', q_str);
   var url = 'https://api.fda.gov/drug/event.json?'+q_str;
   request(url, function(err, resp, body) {
     body = JSON.parse(body);
     var output= {
       medicinalproduct : [],
       reaction:[]
     };
     if(body.results){
       
       //console.log('product_type',body.results);
       _.forEach(body.results,function(v,key){
          _.forEach(v.patient.drug, function(p, k){
              var drug = {
                product:p.medicinalproduct,
                rotue:[]
              };
              if(p.openfda){
                _.forEach(p.openfda.route, function(p,k){
                  drug.rotue.push(p);
                });
              }
              
             output.medicinalproduct.push(drug);
             
           });
            _.forEach(v.patient.reaction, function(p, k){
           //  console.log('reactionmeddrapt is %s', p.reactionmeddrapt);
              output.reaction.push(p.reactionmeddrapt);
             
           });
           
           
       });
        console.log("output is %O", output);
      }
      res.send(output);
   });
});

// Set server port
app.listen(config.server_port);
console.log('server is running');