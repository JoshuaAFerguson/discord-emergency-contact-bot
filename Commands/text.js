const fetch = require('node-fetch');

module.exports = {
    name: 'text',
    description: 'Text a user!',
    usage: '<@user>',
    cooldown: 180,
    async execute(msg, args) {
        const member = msg.guild.members.cache.find(user => user.id === msg.author.id)
        const roles = msg.guild.roles.cache.find(role => role.name === 'Phat ASHs');

        if (member._roles.find(id => id === roles.id))
        {
            if (msg.mentions.users.size) {
                const taggedUser = msg.mentions.users.first();
                const result = await fetch(`http://localhost:3000/contact/${taggedUser.id}`);
                const resultData = await result.json();

                if(resultData.success)
                {
                    const text = await fetch(`http://localhost:3000/text/`, {
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
                    msg.reply(`Texting ${taggedUser}.`);
                } else {
                    msg.reply('User does not have a registered phone number!');
                }
                
            } else {
                msg.reply('Please tag a valid user!');
            }   
        } else {
            msg.reply('You do not have the correct permissions to execute that command.');
        }
    },
};