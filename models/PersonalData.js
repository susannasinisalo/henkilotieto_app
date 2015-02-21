    var mongoose = require('mongoose');
    
    var personalDataSchema = mongoose.Schema( {
        firstName: String,
        lastName: String,
        email: String,
        socialSequrityNum: String,
        dateOfBirth: Date
    });
    var PersonalData = mongoose.model('PersonalData', personalDataSchema);
    
    module.exports = PersonalData;