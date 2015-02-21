// Establish connection to database

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/henkilotieto_app');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'database connection error:'));

db.once('open', function (callback) {
    console.log('database connection established');
});

module.exports = db;