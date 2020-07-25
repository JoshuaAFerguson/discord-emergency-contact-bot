const mongoose = require('mongoose');

const TimersSchema = mongoose.Schema({
        userID: {type: String, required: true},
        channelID: {type: String, required: true},
        dateAdded: {type: String, required: true},
        timeout: {type: String, required: true},
});

module.exports = mongoose.model('Timer', TimersSchema);