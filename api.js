require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DBURL, {useNewUrlParser: true, useUnifiedTopology: true});

const Contact = require('./Models/Contact');
const LocalNumber = require('./Models/LocalNumber');

const accountSid = process.env.SID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

const express = require('express');

const api = express();

api.use(express.json());

const contact = require('./Routes/contact');
const call = require('./Routes/call');
const text = require('./Routes/text');
const timers = require('./Routes/timers');

api.use('/contact', contact);
api.use('/call', call);
api.use('/text', text);
api.use('/timer', timers);

api.listen(3000, () => console.log(`API now listening on port 3000`));




