/*
  author: venu duggireddy
  description: Applicatoin server that servers http request that servers html files and API service calls
*/
var express = require('express'),
 app = express(),
 path = require('path'),
 request = require('request'),
 bodyParser = require('body-parser'),
 _ = require('lodash-node'),
 config = require('./config'),
 utils = require('./utils'),
 HashMap = require('hashmap'),
 https = require('https'),
 cors = require('cors');



// enable cors for corss domain request for mobile application
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
// static routes
app.use('/bower_components',  express.static( path.join(__dirname + '/bower_components')));
app.use('/static',  express.static( path.join(__dirname + '/static')));
app.use('/img',  express.static( path.join(__dirname + '/static/img')));
app.use('/css',  express.static( path.join(__dirname + '/static/css')));
app.use('/js',  express.static( path.join(__dirname + '/static/js')));
app.use('/pages',  express.static( path.join(__dirname + '/static/pages')));

// API routers

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname+'/static/pages/index.html'));
});

app.get("/search", function(req, res){
  res.sendFile(path.join(__dirname+'/static/pages/searchPage.html'));
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
  build search query
*/
var getSearchQuery = function(daterange, loc, key_term){

  var search = '';

  if(!_.isEmpty(daterange)){
     search = search +'report_date:'+daterange.replace(/\s/g,'+');
  }
  if(!_.isEmpty(loc)){
    if(!_.isEmpty(search)){
      search = search +'+AND+';
    }
    if(_.isArray(loc)){
      loc = loc.join('+');
    }
    search = search +'distribution_pattern:('+loc+')';
  }
  if(! _.isEmpty(key_term)){
    if(!_.isEmpty(search)){
      search = search +'+AND+';
    }
     search = search + key_term;
  }
  return search;

}

/*
 sprint 2 use case where user will enter product_type and location to find recall information
*/
app.get('/recallInfo', function(req, res) {

   var product_type =  req.query.product_type;
   var key_term =   req.query.key_term;
   var daterange=  req.query.daterange;
   var loc= req.query.locations || 'Nationwide';

   var enforcement = utils.getEnforcementUrl(product_type);
   var search = getSearchQuery(daterange, loc, key_term);
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
    var product_type =  req.query.product_type;
    var key_term =   req.query.key_term;
    var daterange=  req.query.daterange;
    var search = getSearchQuery(daterange, '', key_term);

    console.log('Search Queyr is %s ', search);
    var result = {};
    var urlTypes = [];
    if(!_.isArray(product_type)){
      urlTypes.push(product_type);
    }else{
       urlTypes = product_type;
    }
    //var url = 'https://api.fda.gov/food/enforcement.json?search=report_date:[2004-01-01+TO+2015-06-24]+AND+wegmans';
    //  var url = 'https://api.fda.gov/drug/enforcement.json?search=distribution_pattern:(VA)+AND+Advil&count=distribution_pattern';
    //var url = 'https://api.fda.gov/food/enforcement.json?search=distribution_pattern:(VA)+AND+wegmans&count=distribution_pattern';
    var reacallMap = new HashMap();
    var statesMap = utils.recallstatemap();
    var values = [];
    _.each(urlTypes, function(product_type){
      var enforcementUrl = utils.getEnforcementUrl(product_type);
      enforcementUrl = enforcementUrl+'api_key='+config.api_key+'&count=distribution_pattern&search='+search;
      console.log("URL for product_type %s is %s", product_type, enforcementUrl);
      request(enforcementUrl, function(err, resp, body) {
          body = JSON.parse(body);
          _.forEach(body.results, function(v, k){
             var term = v.term.toUpperCase();
             var count = v.count;
             if(statesMap.get(term)){ // valid state
                if(reacallMap.count() > 0 && reacallMap.get(term)){
                   var t = reacallMap.get(term);
                   reacallMap.set(term, (t.count+count));
                }else{
                    reacallMap.set(term, {
                        'count':count,
                         type:product_type
                      });
                }
              //  console.log("Value is %s and %d and %O", term,count, reacallMap.get(term) );
             }
          });
          reacallMap.forEach(function(value, key) {
            //  console.log(key + " : " + value);
              var result = {
                state: key,
                'value': value
              };
              values.push(result);
          });
            res.send(values);
       });

    });

});





app.get('/recallmapview2', function(req, res) {
    var product_type =  req.query.product_type;
    var key_term =   req.query.key_term;
    var daterange=  req.query.daterange;
    var search = getSearchQuery(daterange, '', key_term);

    console.log('Search Queyr is %s ', search);
    var result = {};
    var urlTypes = [];
    if(!_.isArray(product_type)){
      urlTypes.push(product_type);
    }else{
       urlTypes = product_type;
    }
    //var url = 'https://api.fda.gov/food/enforcement.json?search=report_date:[2004-01-01+TO+2015-06-24]+AND+wegmans';
    //  var url = 'https://api.fda.gov/drug/enforcement.json?search=distribution_pattern:(VA)+AND+Advil&count=distribution_pattern';
    //var url = 'https://api.fda.gov/food/enforcement.json?search=distribution_pattern:(VA)+AND+wegmans&count=distribution_pattern';
    /*
    var reacallMap = new HashMap();
    var statesMap = utils.recallstatemap();
    var values = [];
    _.each(urlTypes, function(product_type){
      var enforcementUrl = utils.getEnforcementUrl(product_type);
      enforcementUrl = enforcementUrl+'api_key='+config.api_key+'&count=distribution_pattern&search='+search;
      console.log("URL for product_type %s is %s", product_type, enforcementUrl);
      request(enforcementUrl, function(err, resp, body) {
          body = JSON.parse(body);
          res.send(values);
       });

    });
    */

    var urls = [
        'https://api.fda.gov/drug/enforcement.json?search=distribution_pattern:(NY)+AND+Advil&count=distribution_pattern',
        'https://api.fda.gov/food/enforcement.json?search=distribution_pattern:(VA)+AND+wegmans&count=distribution_pattern'
                ];
    var completed_requests = 0;
      var responses = [];
    urls.forEach(function(url) {

      https.get(url, function(resp) {
        resp.on('data', function(chunk){
          responses.push(chunk.toString('utf8'));
        });

        resp.on('end', function(){
          console.log("completed request are %d and url length is %d", completed_requests, urls.length);
          if (completed_requests++ == urls.length - 1) {
            // All downloads are completed
            console.log("Done !! completed request are %d and url length is %d and length of response is", completed_requests, urls.length, responses.length);
            responses.join();
            res.send(responses);
          }
        });
      });
    })

});



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
