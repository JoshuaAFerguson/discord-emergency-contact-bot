const express = require('express');
const router = express.Router();
const Contact = require('../Models/Contact');

router.get('/', (req, res) => {
    Contact.find()
        .then(result => {
            res.send({success: true, result:{ ...result } });
        })
        .catch(error => {
            res.send({success: false, error});
        });
});

router.get('/:id', (req, res) => { 
    const discordID = req.params.id;

    Contact.findOne({userID: discordID})
        .then(result => {
            if (result){
                res.send({success: true, result});
            } else {
                res.send({success: false, result});
            }
        })
        .catch(error => {
            res.send({success: false, error});
        });
});

router.put('/:id', (req, res) => {
    const discordID = req.params.id;
    
    Contact.findOne({userID: discordID})
        .then(contact => {
            contact.userID = discordID;
            contact.phoneNumber = req.body.phoneNumber;
            contact.localNumber = req.body.localNumber;
            contact.countryCode = req.body.countryCode;

            return contact.save();
        })
        .then(result => {
            res.send({success: true, result});
        })
        .catch(error => {
            res.send({success: false, error});
        });
});

router.post('/', (req, res) => {
    const contact = new Contact({
        userID: req.body.userID,
        phoneNumber: req.body.phoneNumber,
        localNumber: req.body.localNumber,
        countryCode: req.body.countryCode,
    });

    contact.save()
        .then(result => {
            res.send({success: true, result});
        })
        .catch(error => {
            res.send({success: false, error});
        });
});

module.exports = router;
