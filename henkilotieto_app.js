var express = require('express');
var app = express();

var mongoose = require('mongoose');
var db = require('./connection').db;
var PersonalData = require('./models/PersonalData').PersonalData;

app.get('/', function (req, res) {
    res.send('Hello World!');
});

/**
 * make() returns a new element
 * based on the passed in tag name
 *
 * @param <String> tag
 * @return <Element> element
 */
app.get('/henkilotieto', function (req, res) {
  res.send('Tässä henkilötieto');
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

