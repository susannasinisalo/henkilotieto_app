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

app.get('/personaldata', function (req, res) {
    PersonalData.find(function (err, docs) {
        if (err){

                // Error with database.
                return res.json(err);
            }
            else{

                // Data was found.
                // Return url to resource and some more info.
                
                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                
                var returnableData = [];
                for (var i = 0; i < docs.length; ++i){
                    returnableData.push({url: fullUrl + "/" + docs[i].id,
                        firstName: docs[i].firstName, lastName: docs[i].lastName,
                        socialSequrityNum: docs[i].socialSequrityNum});
                }
                res.status(200).json(returnableData);
            }
    });
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
                
                // The dates are expected to be Finnish date and time is set
                // to 2 to make the date 00 universal time.
                // It would have been possible to set utc -0 time with
                // moment library but otherwise the library was a bit stiff
                // with parsing dates so I decided to go with this implementation.
                // TODO: Find a better way for date localisation problems.
                dateOfBirth: new Date(req.body.dateOfBirth).setHours(2)
            });
            data.save(function (err) {
            if (err){

                // Error with database.
                return res.json(err);
            }
            else{

                // New data was succesfully added.
                // Write url for the resource to the data and send it back to client.
                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                var returnableData = {url: fullUrl + "/" + data.id,
                        firstName: data.firstName, lastName: data.lastName,
                        email: data.email, socialSequrityNum: data.socialSequrityNum,
                        dateOfBirth: data.dateOfBirth};
                res.status(201).json(returnableData);
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
            return res.json(err);
        }
        else if (data) {
            
            // Data was found.
            console.log(data);
            return res.status(200).json(data);
        }
        else {
            
            //Data was not found with the given parameter.
            console.log("not found");
            return res.status(404).end("Resource not found.");
        }
    });
});

app.delete('/personaldata/:id', function(req, res) {
    PersonalData.findById(req.params.id, function (err, data) {
        if (err) {
            
            //Error occured.
            return res.json(err);
        }
        else if (data) {
            
            // Data was found now we can delete it.
            data.remove(function (err) {
                if (err) {
            
                    //Error occured.
                    return res.json(err);
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
            return res.status(404).send("Resource not found.");
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
                    return res.json(err);
                }
                else if (data) {

                    // Data was found now we can update.
                    data.firstName = req.body.firstName;
                    data.lastName = req.body.lastName;
                    data.email = req.body.email;
                    data.socialSequrityNum = req.body.socialSequrityNum;
                    
                    // This solution is explained in post function around line 46.
                    data.dateOfBirth = new Date(req.body.dateOfBirth).setHours(2);
     
                    
                    data.save(function (err) {
                      if (err){
                          return res.json(err);
                      }
                      else{
                            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                            var returnableData = {url: fullUrl,
                                    firstName: data.firstName, lastName: data.lastName,
                                    email: data.email, socialSequrityNum: data.socialSequrityNum,
                                    dateOfBirth: data.dateOfBirth};
                            res.status(200).json(returnableData);
                      }
                    });
                }
                else {

                    //Data was not found with the given parameter.
                    return res.status(404).send("Resource not found.");
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
                var ssnEnd = ssn.slice(7,12);
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
                    return callback(false, 400, "Validation error. checkSum " + checkSum + " taulukossa " + ssnValidationSums[remainder] + " arvo: " + ssnNumber + " ssnStart: " + ssnStart + " end: "+ ssnEnd);
                    
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