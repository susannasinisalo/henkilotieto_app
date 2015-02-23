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

var ssnValidationSums = ["0", "1", "2", "3", "4", "5","6","7","8","9","a","b",
    "c","d","e","f","h","j","k","l","m","n","p","r","s","t","u","v","w","x","y"];

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
    
    // Validation.
    validateData(req, function(validationPassed, statusCode, message){
        
        if (validationPassed) {
            
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
        }
        else{
            
            // Validation failed.
            res.status(statusCode).send(message);
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
    
    // Validation. 
    validateData(req, function(validationPassed, statusCode, message){
        
        if (validationPassed) {
            
            //Validation passed.
    
            PersonalData.findById(req.params.id, function (err, data) {
                if (err) {

                    //Error occured.
                    return res.log(err);
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
        }
        else{
            
            // Validation failed.
            res.status(statusCode).send(message);
        }
    });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

var validateData = function( req, callback){
    // Validation 1: Are all required parameters given?
    if(req.body.firstName && req.body.lastName &&
            req.body.email && req.body.socialSequrityNum &&
            req.body.dateOfBirth){
        
        // Parse given birth date.
        var birthDate;
        birthDate = new Date(req.body.dateOfBirth);
        
        // Check wether date is somehow convertable to date.
        // JavaScript accepts for example a date 30.2 and interprets it to 2.3
        // At the same time we can check that social sequrity number contains 
        // 11 charaters.
        // TODO: Check wether given date really exists.
        if(!isNaN(birthDate.getTime()) && req.body.socialSequrityNum.length == 11){
            
            // Create social sequrity number first part from the birth date given.
            var ssnStart = ('0' + birthDate.getDate()).slice(-2)+('0' 
                    + (birthDate.getMonth()+1)).slice(-2)
                    + (birthDate.getFullYear().toString()).slice(-2);
            
            // Decide which connector is used in social sequrity number.
            var ssnConnector = "";
            if (birthDate.getFullYear() < 1900) {
               ssnConnector = "+"; 
            }
            else if (birthDate.getFullYear() < 2000) {
                ssnConnector = "-"; 
            }
            else {
                ssnConnector = "a"; 
            }
            
            var ssn = req.body.socialSequrityNum.toLowerCase();
            
            // Check wether given social sequrity number start and 
            // the one generated from birth date match.
            if ( (ssnStart + ssnConnector) == ssn.slice(0,7)){
                
                // Check social sequrity number validation sum. It is calculated accordingly:
                // birth date at the start and personal number at the end is combined
                // to one 9 digit number and it is divided by 31. The division
                // remainder will be one of the values shown on table ssnValidationSums
                // defined at the start of this file.
                var ssnEnd = ssn.slice(8,12);
                var ssnNumber = parseInt(ssnStart + ssnEnd);
                var remainder = ssnNumber % 31;
                var checkSum = ssn.slice(10,11);
                
                if(checkSum == ssnValidationSums[remainder]){
                    
                    // Social sequrity passed validation.
                    
                    // Check name and email adress.
                    if(!validator.isNull(req.body.firstName.trim()) &&
                          !validator.isNull(req.body.lastName.trim()) && 
                           validator.isEmail(req.body.email.trim())) {

                        // Validation passed.
                        return callback(true, 200, "Validation passed.");
                    }
                    else{
                        
                        // Validation failed.
                        return callback(false, 400, "Validation error.");
                    }
                }
                else{
                    
                    // Check sum didn't match the value calculated from social sequrity number given
                    return callback(false, 400, "Validation error.");
                    
                }
            }
            else{
                
                // Birth date given didn't match social sequrity number.
                return callback(false, 400, "Validation error.");
            }
        }
        else{
            
            // Birth date given wasn't a proper date or social sequrity number
            // wasn't the right length.
            return callback(false, 400, "Validation error.");
        }
    }
    else{
        
        // One or more of the required parameters was not given and
        // the request cannot be accepted.
        return callback(false, 400, "Missing parameters.");
    }
};