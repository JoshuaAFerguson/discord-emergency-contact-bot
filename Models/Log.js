const mongoose = require('mongoose');

const LogSchema = mongoose.Schema({
        userID: {type: String, required: true},
        eventType: {type: String, required: true},
        eventTargetID:{type: String, required: true},
        status: {type: String, required: true},
        sid: {type: String, required: true},
        timeRequested: {type: String, required: true},
        channelID: {type: String, required:true}
});

module.exports = mongoose.model('Log', LogSchema);