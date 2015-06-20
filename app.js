// set variables for environment
var express = require('express'),
 app = express(),
 path = require('path'),
 request = require('request'),
 querystring = require('querystring'),
 _ = require('lodash-node'),
 config = require('./config'),
 cors = require('cors');



// enable cors for corss domain request for mobile application
app.use(cors());

// static routes
app.use('/bower_components',  express.static( path.join(__dirname + '/bower_components')));
app.use('/static',  express.static( path.join(__dirname + '/static')));
app.use('/img',  express.static( path.join(__dirname + '/static/img')));
app.use('/css',  express.static( path.join(__dirname + '/static/css')));
app.use('/js',  express.static( path.join(__dirname + '/static/js')));
app.use('/pages',  express.static( path.join(__dirname + '/pages')));

// API routers

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get("/page2", function(req, res){
  res.sendFile(path.join(__dirname+'/index2.html'));
});

app.get('/search', function(req, res) {
  //res.send('hello open fda');
   var q = req.query.q;
   console.log("Search Query is %s", q);

   // request module is used to process the yql url and return the results in JSON format
   var q_str = 'api_key='+config.api_key+'&search=generic_name:'+q;
   //console.log('%s', q_str);
   var url = config.base_url+q_str;
   request(url, function(err, resp, body) {
     body = JSON.parse(body);
     var output= {
       medicinalproduct : [],
       reaction:[]
     };
     if(body.results){

         // traverse each req to get drug, route and reaction information
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
              output.reaction.push(p.reactionmeddrapt);
           });


       });
        // console.log("output is %O", output);
      }
      res.send(output);
   });
});

/*
 sprint 2 use case where user will enter product_type and location to find recall information
*/
app.get('/recallInfo', function(req, res) {
   var product_type =  req.query.product_type;
   var loc= req.query.locations;
   if(_.isArray(loc)){
     loc = loc.join('+');
   }
   //https://api.fda.gov/drug/enforcement.json?search=report_date:[2004-01-01+TO+2015-06-20]+AND+state:(VA+DE)&limit=100
   var q_str = 'api_key='+config.api_key+'&search=state:('+loc+')&limit=100';
//   var url1 = config.drug_enforcement_url+'search=state:('+loc+')&limit=100';
  // console.log("%s %O", q_str, config);
   var url = config.drug_enforcement_url+q_str;
   
   request(url, function(err, resp, body) {
     body = JSON.parse(body);
     var output= {
       meta:{},
       results:[]
     };
     output.meta = body.meta;
     if(body.results){
           _.forEach(body.results,function(v,key){
                var o = {
                  recall_initiation_date:v.recall_initiation_date,
                  product_description:v.product_description,
                  code_info:v.code_info,
                  recalling_firm:v.recalling_firm,
                  openfda: v.openfda.unii
                }
                //console.log(o);
                output.results.push(o);
           });
       }

      res.send(output);
   });

});
/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/
// Set server port
app.listen(config.server_port);
console.log('server is running');

//module.exports = app;
