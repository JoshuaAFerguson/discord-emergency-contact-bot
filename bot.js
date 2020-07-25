require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const fetch = require('node-fetch');


const express = require('express');

const callback = express();

callback.use(express.json());

callback.listen(3001, () => console.log(`Bot now listening on port 3001`));

callback.post('/', async (req, res) => {
  const sid = req.body.sid;
  const status = req.body.status;

  console.log(sid);

  const event = await fetch(`http://localhost:3000/call/${sid}`);
  const eventData = await event.json();

  console.log(eventData);
  if (eventData.success){
    const type = eventData.result.eventType;
    const user = bot.users.cache.get(eventData.result.eventTargetID);
    const mention = bot.users.cache.get(eventData.result.userID);
    const channel = bot.channels.cache.get(eventData.result.channelID);

    channel.send(`${mention}, the current ${type} to ${user} is: ${status}`);
    res.send({success: true})

  } else {
    res.send({success: false})
  }
});


bot.commands = new Discord.Collection();
const botCommands = require('./Commands');

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
  });


const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.once('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    const args = msg.content.split(/ +/);
    const prefix = '!cb';

    const commandPrefix = args.shift().toLowerCase();

    if (commandPrefix === prefix){
        const command = args.shift().toLowerCase();

        console.info(`Called command: ${command}`);

        if (!bot.commands.has(command)) {

            msg.reply(`No command named: ${command}`);
            return;
        }

        try {
            bot.commands.get(command).execute(msg, args);
          } catch (error) {
            console.error(error);
            msg.reply('there was an error trying to execute that command!');
          }
    }
    
  
    
  

});