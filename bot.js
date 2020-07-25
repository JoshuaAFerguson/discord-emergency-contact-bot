require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const fetch = require('node-fetch');

const express = require('express');

const callback = express();

callback.use(express.json());

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

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

const cooldowns = new Discord.Collection();

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);


bot.once('ready', async () => {
    console.info(`Logged in as ${bot.user.tag}!`);

    const timers = await fetch('http://localhost:3000/timer');
    const timersData = await timers.json();

    //console.log(timersData.result[0]);
    if(timersData.success) {
      //console.log('success')

      console.log(timersData.result.length)

      asyncForEach(timersData.result, async (timer) => {
        console.log(timer)
        const user = await fetch(`http://localhost:3000/contact/${timer.userID}`);
        const resultData = await user.json();

        console.log(resultData);

        if (resultData.success){


        const timeout = timer.timeout - Date.now();

        console.log(timeout);

        setTimeout(async () => {
          const call = await fetch(`http://localhost:3000/call/timer`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: resultData.result.phoneNumber,
                from: process.env.OUTGOING_NUMBER,
                userID: timer.userID,
                eventTargetID: timer.userID,
                channelID: timer.channelID
            }),
            });

          }, timeout);
      };
    });
  }
    
});

bot.on('message', msg => {
    const args = msg.content.split(/ +/);
    const prefix = '!cb';

    const commandPrefix = args.shift().toLowerCase();

    if (commandPrefix === prefix){
        const commandName = args.shift().toLowerCase();



        console.info(`Called command: ${commandName}`);

        if (!bot.commands.has(commandName)) {

            msg.reply(`No command named: ${commandName}`);
            return;
        }

        const command = bot.commands.get(commandName);


        if (!cooldowns.has(command.name)) {
          cooldowns.set(command.name, new Discord.Collection());
        }
        
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        
        if (timestamps.has(msg.author.id)) {
          const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

          if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return msg.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
          }
        }

        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

        try {
            command.execute(msg, args);
          } catch (error) {
            console.error(error);
            msg.reply('There was an error trying to execute that command!');
          }
    }
    
  
    
  

});