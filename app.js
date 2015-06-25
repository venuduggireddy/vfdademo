/*
  author: venu duggireddy
  description: Applicatoin server that servers http request that servers html files and API service calls
*/
var express = require('express'),
 app = express(),
 path = require('path'),
 request = require('request'),
 querystring = require('querystring'),
 _ = require('lodash-node'),
 config = require('./config'),
 utils = require('./utils'),
 HashMap = require('hashmap'),
 http = require('http'),
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
  res.sendFile(path.join(__dirname+'/index2.html'));
});

app.get("/search", function(req, res){
  res.sendFile(path.join(__dirname+'/pages/searchPage.html'));
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

   var key_term =   req.query.key_term;
   var daterange=  req.query.daterange;
   var enforcement = getEnforcementUrl(product_type);
   var loc= req.query.locations;
   if(_.isArray(loc)){
     loc = loc.join('+');
   }
   var search = '';

   if(!_.isEmpty(daterange)){
      search = search +'report_date:'+daterange;
   }
   if(!_.isEmpty(loc)){
     if(!_.isEmpty(search)){
       search = search +'+AND+';
     }
      search = search +'distribution_pattern:('+loc+')';
   }
   if(! _.isEmpty(key_term)){
     if(!_.isEmpty(search)){
       search = search +'+AND+';
     }
      search = search + key_term;
   }

   //console.log('URL Str is %s', search);
   //https://api.fda.gov/drug/enforcement.json?search=report_date:[2004-01-01+TO+2015-06-20]+AND+state:(VA+DE)&limit=100
   var q_str = 'api_key='+config.api_key+'&limit=100&search='+search;
//   var url1 = config.drug_enforcement_url+'search=state:('+loc+')&limit=100';

   var url = enforcement+q_str;
    console.log("%s", url);
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
                  recall_number:v.recall_number,
                  recall_initiation_date:v.recall_initiation_date,
                  product_description:v.product_description,
                  code_info:v.code_info,
                  recalling_firm:v.recalling_firm,
                  state:v.state,
                  city:v.city,
                  country:v.country,
                  distribution_pattern:v.distribution_pattern,
                  reason_for_recall:v.reason_for_recall,
                  classification:v.classification,
                  product_quantity:v.product_quantity,
                  openfda:v.openfda.unii,
                  event_details:{
                    event_id:v.event_id,
                    product_type:v.product_type,
                    status:v.status,
                    recalling_firm:v.recalling_firm,
                    state:v.state,
                    city:v.city,
                    country:v.country,
                    recall_initiation_date:v.recall_initiation_date,
                    voluntary_mandated:v.voluntary_mandated,
                    distribution_pattern:v.distribution_pattern,
                    initial_firm_notification:v.initial_firm_notification
                  }
                };
                //console.log(o);
                output.results.push(o);
           });
       }

      res.send(output);
   });

});


app.get('/recallmapview', function(req, res) {
    var product_types =  req.query.product_type;
    var search = req.query.search;
    console.log('product_types %s and is array %s ',product_types, _.isArray(product_types));
    var result = {};
    var urlTypes = [];
    if(!_.isArray(product_types)){
      urlTypes.push(product_types);
    }else{
       urlTypes = product_types;
    }
    //var url = 'https://api.fda.gov/food/enforcement.json?search=report_date:[2004-01-01+TO+2015-06-24]+AND+wegmans';
    var url = 'https://api.fda.gov/drug/enforcement.json?search=distribution_pattern:(Nationwide)+AND+Advil&count=distribution_pattern';
    var reacallMap = new HashMap();
    var statesMap = utils.recallstatemap();

    _.each(urlTypes, function(product_type){
      var enforcementUrl = getEnforcementUrl(product_type);
      console.log("URL for product_type %s is %s", product_type, enforcementUrl);
      request(url, function(err, resp, body) {
          body = JSON.parse(body);
          _.forEach(body.results, function(v, k){
             console.log("Value is %s and %d and %s", v.term, v.count, statesMap.get(v.term.toUpperCase()));
             if(statesMap.get(v.term.toUpperCase())){
               console.log("Value is %s and %d", v.term, v.count);
                reacallMap.set(v.term.toUpperCase(),v.count);
             }
          });
          res.send(reacallMap);
       });

    });

});

var getProductTypeCount = function(url){

}

/*
 ger the url based on product_type
*/
var getEnforcementUrl = function(product_type){
  var enforcement = '';
  if(_.isEmpty(product_type) || product_type === 'drug'){
    enforcement =   config.drug_enforcement_url;
  }else if (product_type === 'device') {
    enforcement =   config.device_enforcement_url;
  }else if(product_type === 'food'){
    enforcement =   config.food_enforcement_url;
  }
  return enforcement;

}


app.all('*', function(req, res) {
  res.sendStatus(404);
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
var server = app.listen(config.server_port, function(){
  var port = server.address().port;
  console.log('server is running %s', port);
});

module.exports = app;
