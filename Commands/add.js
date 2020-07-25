const { parsePhoneNumberFromString } = require('libphonenumber-js');
const fetch = require('node-fetch');

module.exports = {
    name: 'add',
    description: 'Add a number to call!',
    async execute(msg, args) {
        var phoneNumber = null;

        const member = msg.guild.members.cache.find(user => user.id === msg.author.id)
        const roles = msg.guild.roles.cache.find(role => role.name === 'Phat ASHs');

        if (member._roles.find(id => id === roles.id))
        {
            if (args.length == 0) {
                msg.reply('Please format the number using international prefix ie(add +1 480 559-8861) or using the 2 digit country code ie(add 480-559-8861 US)');
                return;
            } else if (args.length == 1) {
                try {
                    phoneNumber = parsePhoneNumberFromString(args[0]);
                } catch (error) {
                    console.log(error);
                    msg.reply('There was an error adding your number please format it correctly.');
                    return;
                }
            } else if (args.length == 2) {
                try {
                    phoneNumber = parsePhoneNumberFromString(args[0], args[1]);
                    
                } catch (error) {
                    console.log(error);
                    msg.reply('There was an error adding your number please format it correctly.');
                    return;
                }
            } else {
                msg.reply('Too many arguments.');
                return;
            }
    
            if(phoneNumber.isValid())
            {
                const result = await fetch(`http://localhost:3000/contact/${msg.author.id}`);
                const resultData = await result.json();

                if(resultData.success)
                {
                    const update = await fetch(`http://localhost:3000/contact/${msg.author.id}`, {
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userID: msg.author.id,
                            phoneNumber: phoneNumber.number,
                            localNumber: phoneNumber.nationalNumber,
                            countryCode: phoneNumber.country,
                        })
                    });

                    const updateData = await update.json();
                    if (updateData.success)
                    {
                        msg.reply('Your number has been sucessfully updated.')
                    } else {
                        console.error(updateData.error);
                        msg.reply('There was an error updating your number.')
                    }

                } else {
                    const update = await fetch(`http://localhost:3000/contact/`, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userID: msg.author.id,
                            phoneNumber: phoneNumber.number,
                            localNumber: phoneNumber.nationalNumber,
                            countryCode: phoneNumber.country,
                        })
                    });

                    const updateData = await update.json();
                    if (updateData.success)
                    {
                        msg.reply('Your number has been sucessfully added.')
                    } else {
                        console.error(updateData.error);
                        msg.reply('There was an error adding your number.')
                    }
                }
            }
        } else {
            msg.reply('You do not have the correct permissions to execute that command.');
        }
      
    },
};

