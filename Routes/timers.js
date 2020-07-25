require('dotenv').config();
const express = require('express');
const router = express.Router();

const Timers = require('../Models/Timers');
const Log = require('../Models/Log');

router.get('/', (req, res) => {
    const now = Date.now(); 
    Timers.find({timeout: {$gt: now}})
        .then(result => {
            if(result){
                //console.log(result);
                res.send({success: true, result: result });
            } else {
                res.send({success: false, error});
            }

        })
        .catch(error => {
            res.send({success: false, error});
        });

});

router.post('/', async (req, res) => {
    const existing = await Timers.find({userID: req.body.userID});

    //if(existing)


    const timer = new Timers({
        dateAdded: req.body.dateAdded,
        timeout: Date.parse(req.body.timeout),
        userID: req.body.userID,
        channelID: req.body.channelID
    });
    //console.log("saving timer to database");
    //console.log(timer);

    timer.save()
        .then(result => {
            res.send({success: true, result});
        })
        .catch(error => {
            res.send({success: false, error});
        });
});

module.exports = router;