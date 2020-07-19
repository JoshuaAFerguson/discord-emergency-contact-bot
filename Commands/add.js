const { parsePhoneNumberFromString } = require('libphonenumber-js');

module.exports = {
    name: 'add',
    description: 'Add a number to call!',
    execute(msg, args) {
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
                    console.info('Parsing Phone Number.');
                    phoneNumber = parsePhoneNumberFromString(args[0]);
                } catch (error) {
                    console.log(error);
                    msg.reply('There was an error adding your number please format it correctly.');
                    return;
                }
            } else if (args.length == 2) {
                try {
                    console.info('Parsing Phone Number with Country Code.');
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
                let location = null;
    
                msg.Contact.find({userID: msg.author.id})
                    .then(contact => {
                        if (contact.length > 0) {
                            console.info('User found!');
                            if (contact[0].phoneNumber == phoneNumber.number)
                            {
                                msg.reply('Contact information already exists.');
                                return;
                            } else {
                                contact[0].phoneNumber = phoneNumber.number;
                                contact[0].localNumber = phoneNumber.nationalNumber;
                                contact[0].countryCode = phoneNumber.country;
    
    
                                //location = phoneNumber.country;
        
                                contact[0].save()
                                    .then(result => {
                                        msg.reply(`Sucessfully updated contact number:${phoneNumber.number} in the database.`);
                                        
                                    })
                                    .catch(err => {
                                        msg.reply('There was an error adding your number to the Database.');
                                        console.log(err)});
    
                            }
                        } else {
                            console.info('User Not found!');
                            const newContact = new msg.Contact({
                                userID: msg.author.id,
                                phoneNumber: phoneNumber.number,
                                localNumber: phoneNumber.nationalNumber,
                                countryCode: phoneNumber.country,
                            });
    
                            newContact.save()
                                .then(result => {
                                    msg.reply(`Sucessfully added ${phoneNumber.number} to the database.`);
                                    
                                })
                                .catch(err => {
                                    msg.reply('There was an error adding your number to the Database.');
                                    console.log(err)});
                        }
                    }).catch(error => {
                        msg.reply('There was an unkown database error.')
                        console.log(error)});
            
    
                //check if user already has a number.
                //add number to DB 
                //respond that a number already exists and is being updated to the new number
    
                //check is local number exists
                //provision local number if necessary
                //Respond with local number to be added to contacts 
            }
        } else {
            msg.reply('You do not have the correct permissions to execute that command.');
        }
      
    },
};

