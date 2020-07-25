require('dotenv').config();
const fetch = require('node-fetch');

module.exports = {
    name: 'call',
    description: 'Call user!',
    async execute(msg, args) {
        const member = msg.guild.members.cache.find(user => user.id === msg.author.id)
        const roles = msg.guild.roles.cache.find(role => role.name === 'Phat ASHs');

        if (member._roles.find(id => id === roles.id))
        {
            if (msg.mentions.users.size) {
                const taggedUser = msg.mentions.users.first();

                const result = await fetch(`http://localhost:3000/contact/${taggedUser.id}`);
                const resultData = await result.json();

                //console.log(resultData);

                if(resultData.success)
                {
                    const call = await fetch(`http://localhost:3000/call/`, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            to: resultData.result.phoneNumber,
                            from: process.env.OUTGOING_NUMBER,
                            userID: msg.author.id,
                            eventTargetID: taggedUser.id,
                            channelID: msg.channel.id
                        })
                      });
                    msg.reply(`Calling ${taggedUser}.`);
                } else {
                    msg.reply('User does not have a registered phone number!');
                }

                //console.info(taggedUser);

                // msg.Contact.find({userID: taggedUser.id})
                //     .then(contact => {
                //         if(contact.length == 0) 
                //         {    
                //             msg.reply('User does not have a registered phone number!');
                //         } else {
                //             msg.LocalNumber.find({countryCode: contact[0].countryCode})
                //                     .then(local => {
                //                         if (local.length == 0)
                //                         {
                //                             msg.reply('Country does not have an available outgoing number!');
                //                         } else {
                //                             msg.channel.send(`Attempting to call: ${taggedUser}`);
                //                             console.info(`Setting up call to ${contact[0].phoneNumber} using ${local[0].number}`);
                //                             msg.TwilioClient.calls.create({
                //                                     url: `${msg.ResponseURL}`,
                //                                     to: `${contact[0].phoneNumber}`,
                //                                     from: `${local[0].number}`
                //                                 }).then(call => {
                //                                     console.info("Call Dispatched");
                //                                     console.log(call)
                //                                 })
                //                                 .catch(error => console.log(error));
                //                         }
                //                         //console.info(msg.TwilioClient.calls);

                //                     }).catch(error => console.log(error));
                //         }
                //     }).catch(error => console.log(error));  
            } else {
                msg.reply('Please tag a valid user!');
            }   
        } else {
            msg.reply('You do not have the correct permissions to execute that command.');
        }
    },
};