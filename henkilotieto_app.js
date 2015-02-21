var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// configure app to use bodyParser()
// get data from a POST method
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var mongoose = require('mongoose');
var db = require('./connection').db;
var PersonalData = require('./models/PersonalData');

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
app.post('/personaldata', function(req, res) {
  var data = new PersonalData({
      firstName: req.body.firstName, 
      lastName: req.body.lastName, 
      email: req.body.email,
      socialSequrityNum: req.body.socialSequrityNum,
      dateOfBirth: new Date(req.body.dateOfBirth)
  });
  data.save(function (err) {
    if (err){
        return console.log(err);
    }
    else{
        console.log(data);
        res.json(data);
    }
  });
});

app.get('/personaldata/:socialSequrityNum', function(req, res) {
    var query  = PersonalData.where({ socialSequrityNum: req.params.socialSequrityNum });
    query.findOne(function (err, data) {
        if (err) {
            
            //Error occured.
            return console.log(err);
        }
        else if (data) {
            
            // Data was found.
            console.log(data);
            return res.json(data);
        }
        else {
            
            //Data was not found with the given parameter.
            console.log("not found");
            return res.send("not found");
        }
    });
});

app.delete('/personaldata/:socialSequrityNum', function(req, res) {
    var query  = PersonalData.where({ socialSequrityNum: req.params.socialSequrityNum });
    query.findOne(function (err, data) {
        if (err) {
            
            //Error occured.
            return console.log(err);
        }
        else if (data) {
            
            // Data was found now we can delete it.
            data.remove(function (err) {
                if (err) {
            
                    //Error occured.
                    return console.log(err);
                }
                else {
            
                    // Delete was succesful.
                    console.log("removed");
                    return res.send('removed');
                }
            });
        }
        else {
            
            //Data was not found with the given parameter.
            console.log("not found");
            return res.send("not found");
        }
    });
});

app.put('/personaldata/:socialSequrityNum', function (req, res) {
  var query  = PersonalData.where({ socialSequrityNum: req.params.socialSequrityNum });
    query.findOne(function (err, data) {
        if (err) {
            
            //Error occured.
            return console.log(err);
        }
        else if (data) {
            
            // Data was found now we can update.
            data.firstName = req.body.firstName;
            data.lastName = req.body.lastName;
            data.email = req.body.email;
            data.dateOfBirth = new Date(req.body.dateOfBirth);
            data.save(function (err) {
              if (err){
                  return console.log(err);
              }
              else{
                  console.log(data);
                  res.json(data);
              }
            });
        }
        else {
            
            //Data was not found with the given parameter.
            console.log("not found");
            return res.send("not found");
        }
    });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

