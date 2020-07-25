require('dotenv').config();
const express = require('express');

const server = express();

const bodyParser = require('body-parser');
server.use(bodyParser.json()); // support json encoded bodies
server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const fetch = require('node-fetch');

const VoiceResponse = require('twilio').twiml.VoiceResponse;

server.listen(1337, () => console.log(`Server now listening on port 1337`));

server.post('/attack', async (req, res) => {
    const twiml = new VoiceResponse();

    twiml.say('Hello, this is Lewd. You are currently under attack in KoH. Get your ass on now!');

    res.type('xml');
    res.send(twiml.toString());
});

server.post('/calls/events', (req, res) => {
  const status = req.body.CallStatus;
  const sid = req.body.CallSid;

  fetch(`http://localhost:3000/call/${sid}`, {
    method: 'put',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status
    })
  });

  fetch(`http://localhost:3001`, {
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sid,
      status
    })
  });

});

server.post('/text/events', (req, res) => {
  const status = req.body.MessageStatus;
  const sid = req.body.MessageSid;

  console.log(req.body);

  fetch(`http://localhost:3000/text/${sid}`, {
    method: 'put',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status
    })
  });

  fetch(`http://localhost:3001`, {
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sid,
      status
    })
  });

});
