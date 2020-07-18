const mongoose = require('mongoose');

const LocalNumberSchema = mongoose.Schema({
        number:{type: String, required: true},
        countryCode: {type: String, required: true},
});

module.exports = mongoose.model('LocalNumber', LocalNumberSchema);