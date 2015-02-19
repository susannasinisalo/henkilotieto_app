/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// will match requests to /about
app.get('/henkilotieto', function (req, res) {
  res.send('Tässä henkilötieto');
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

