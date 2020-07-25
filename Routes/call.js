require('dotenv').config();
const express = require('express');
const router = express.Router();
const Log = require('../Models/Log');

const accountSid = process.env.SID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

router.get('/', (req, res) => {
    Log.find({eventType: 'CALL'})
        .then(result => {
            res.send({success: true, result});
        })
        .catch(error => {
            res.send({success: false, error});
        })

});

router.get('/:id', (req, res) => {
    Log.findOne({sid: req.params.id})
    .then(result => {
        res.send({success: true, result});
    })
    .catch(error => {
        res.send({success: false, error});
    }) 
});

router.post('/', async (req, res) => {
    const call = await client.calls.create({
        url: process.env.RESPONSEURL,
        to: req.body.to,
        from: req.body.from,
        statusCallback: process.env.CALLBACKURL,
        statusCallbackMethod: 'POST',
        statusCallbackEvent: ['ringing', 'initiated', 'answered', 'completed'],
    });

    const eventLog = new Log({
        userID: req.body.userID,
        eventType: 'CALL',
        eventTargetID: req.body.eventTargetID,
        status: 'initiated',
        sid: call.sid,
        timeRequested: Date.now(),
        channelID: req.body.channelID
    });

    result = await eventLog.save()
        .then(result => {
            res.send({success: true, result});
        })
        .catch(error => {
            res.send({success: false, error});
        });
    
});

router.put('/:id', async (req, res) => {
    Log.findOne({sid: req.params.id})
        .then(result => {
            result.status = req.body.status;
            return result.save();
        })
        .then(result => {
            res.send({success: true, result});
        })
        .catch(error => {
            res.send({success: false, error});
        });


});

module.exports = router;