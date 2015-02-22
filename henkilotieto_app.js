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

var validator = require('validator');

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
    
    // Validation 1: Are all required parameters given?
    if(req.body.firstName && req.body.lastName &&
            req.body.email && req.body.socialSequrityNum &&
            req.body.dateOfBirth){
        
        // TODO: At the moment validator.isDate doesn't check wether
        // given date exists in the given month for example 30.2 is accepted.
        // TODO: At the moment only the form of social sequrity number is 
        // checked. The check sum isn't calculated. Neither is the birth date
        // gotten from the number compared with the birth date given.
        // Validation 2: Are all parameters in the right form?
        if(validator.isNull(req.body.firstName.trim()) ||
               validator.isNull(req.body.lastName.trim()) || 
               !validator.isEmail(req.body.email.trim()) ||
               !validator.isDate(req.body.dateOfBirth) ||
               !validator.matches(req.body.socialSequrityNum, /^\d{6}(-|\\+|a)\d{3}.$/)) {
            
            // Validation failed.
            return res.status(400).send("Validation error.");
        }
    }
    else{
        
        // One or more of the required parameters was not given and
        // the request cannot be accepted.
        return res.status(400).send("Missing parameters.");
    }
    
    //Validation passed.
    
    // Create new personal data object and save it.
    var data = new PersonalData({
        firstName: req.body.firstName, 
        lastName: req.body.lastName, 
        email: req.body.email,
        socialSequrityNum: req.body.socialSequrityNum,
        dateOfBirth: new Date(req.body.dateOfBirth)
    });
  data.save(function (err) {
    if (err){
        
        // Error with database.
        return console.log(err);
    }
    else{
        
        // New data was succesfully added.
        console.log(data);
        res.status(201).json(data);
    }
  });
});

app.get('/personaldata/:id', function(req, res) {
    PersonalData.findById(req.params.id, function (err, data) {
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
            return res.status(404).end();
        }
    });
});

app.delete('/personaldata/:id', function(req, res) {
    PersonalData.findById(req.params.id, function (err, data) {
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
                    return res.status(204).end();
                }
            });
        }
        else {
            
            //Data was not found with the given parameter.
            console.log("not found");
            return res.status(404).end();
        }
    });
});

app.put('/personaldata/:id', function (req, res) {
    
    // Validation 1: Are all required parameters given?
    if(req.body.firstName && req.body.lastName &&
            req.body.email && req.body.socialSequrityNum &&
            req.body.dateOfBirth){
        
        // TODO: At the moment validator.isDate doesn't check wether
        // given date exists in the given month for example 30.2 is accepted.
        // TODO: At the moment only the form of social sequrity number is 
        // checked. The check sum isn't calculated. Neither is the birth date
        // gotten from the number compared with the birth date given.
        // Validation 2: Are all parameters in the right form?
        if(validator.isNull(req.body.firstName.trim()) ||
               validator.isNull(req.body.lastName.trim()) || 
               !validator.isEmail(req.body.email.trim()) ||
               !validator.isDate(req.body.dateOfBirth) ||
               !validator.matches(req.body.socialSequrityNum, /^\d{6}(-|\\+|a)\d{3}.$/)) {
            
            // Validation failed.
            return res.status(400).send("Validation error.");
        }
    }
    else{
        
        // One or more of the required parameters was not given and
        // the request cannot be accepted.
        return res.status(400).send("Missing parameters.");
    }
    
    //Validation passed.
    
    PersonalData.findById(req.params.id, function (err, data) {
        if (err) {
            
            //Error occured.
            return console.log(err);
        }
        else if (data) {
            
            // Data was found now we can update.
            data.firstName = req.body.firstName;
            data.lastName = req.body.lastName;
            data.email = req.body.email;
            data.socialSequrityNum = req.body.socialSequrityNum;
            data.dateOfBirth = new Date(req.body.dateOfBirth);
            data.save(function (err) {
              if (err){
                  return console.log(err);
              }
              else{
                  console.log(data);
                  res.status(200).json(data);
              }
            });
        }
        else {
            
            //Data was not found with the given parameter.
            console.log("not found");
            return res.status(404).end();
        }
    });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

