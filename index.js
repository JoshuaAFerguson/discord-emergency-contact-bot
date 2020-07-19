require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.commands = new Discord.Collection();
const botCommands = require('./Commands');

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
  });

const server = require('./server.js')

const mongoose = require('mongoose');

mongoose.connect(process.env.DBURL, {useNewUrlParser: true, useUnifiedTopology: true});

const Contact = require('./Models/Contact');
const LocalNumber = require('./Models/LocalNumber');

const TOKEN = process.env.TOKEN;

const accountSid = process.env.SID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

bot.login(TOKEN);

bot.on('ready', () => {
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
            //msg.parsePhoneNumberFromString = parsePhoneNumberFromString;
            msg.AdminID = process.env.ADMINID;
            msg.ResponseURL = process.env.RESPONSEURL;
            msg.TwilioClient = client;
            msg.Contact = Contact;
            msg.LocalNumber= LocalNumber;
            bot.commands.get(command).execute(msg, args);
          } catch (error) {
            console.error(error);
            msg.reply('there was an error trying to execute that command!');
          }
    }
    
  
    
  

});