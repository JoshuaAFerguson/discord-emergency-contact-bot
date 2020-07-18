const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
        userID: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        localNumber:{type: String, required: true},
        countryCode: {type: String, required: true},
});

module.exports = mongoose.model('Contact', ContactSchema);