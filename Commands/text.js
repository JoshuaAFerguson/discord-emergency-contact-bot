module.exports = {
    name: 'text',
    description: 'Text a user!',
    execute(msg, args) {
        const member = msg.guild.members.cache.find(user => user.id === msg.author.id)
        const roles = msg.guild.roles.cache.find(role => role.name === 'Phat ASHs');

        if (member._roles.find(id => id === roles.id))
        {
            if (msg.mentions.users.size) {
                const taggedUser = msg.mentions.users.first();


                msg.Contact.find({userID: taggedUser.id})
                    .then(contact => {
                        if(contact.length == 0) 
                        {    
                            msg.reply('User does not have a registered phone number!');
                        } else {
                            msg.LocalNumber.find({countryCode: contact[0].countryCode})
                                    .then(local => {
                                        if (local.length == 0)
                                        {
                                            msg.reply('Country does not have an available outgoing number!');
                                        } else {
                                            msg.channel.send(`Attempting to text: ${taggedUser}`);
                                            console.info(`Setting up text to ${contact[0].phoneNumber} using ${local[0].number}`);

                                            msg.TwilioClient.messages.create({
                                                    body: 'This is Lewd. You are currently under attack in KoH!',
                                                    from: `${local[0].number}`,
                                                    to: `${contact[0].phoneNumber}`
                                                })
                                                .then(message => {
                                                    console.log('Text Sent');
                                                    console.log(message.sid);
                                                })
                                                .catch(error => console.log(error));;
                                        }

                                    }).catch(error => console.log(error));
                        }
                    }).catch(error => console.log(error));  
            } else {
                msg.reply('Please tag a valid user!');
            }   
        } else {
            msg.reply('You do not have the correct permissions to execute that command.');
        }
    },
};