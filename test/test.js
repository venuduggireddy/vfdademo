var app  = require(__dirname + '/../app.js'),
config = require(__dirname + '/../config.js');
var http = require('http');
var assert = require("assert");
var request = require('supertest');

var port = config.server_port;
console.log(port);


describe('app', function () {
  it('server port should be listen on 4000', function(){
     assert.equal(port, 4000);

   })
});

describe('GET /', function(){
  it('respond with html', function(done){
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(200, done);
  })
})
