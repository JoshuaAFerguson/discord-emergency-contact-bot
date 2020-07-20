const { parsePhoneNumberFromString } = require('libphonenumber-js');

module.exports = {
    name: 'local',
    description: 'Add a local number to call from.',
    execute(msg, args) {
        if (msg.author.id === msg.AdminID) {
            console.info('Executing Administration Command');
            if (args.length == 0){
                msg.LocalNumber.find()
                            .then(number => {
                                msg.channel.send(' | Location Code | Phone Number |');
                                number.forEach(localNumber => {
                                    msg.channel.send(` | ${localNumber.countryCode} | ${localNumber.number} |`);
                                });                  
                            })
                            .catch(error => console.log(error));
            } else if (args.length == 3) {
                if (args[0] == 'add') {
                    try {
                    console.info('Parsing Phone Number with Country Code.');
                    phoneNumber = parsePhoneNumberFromString(args[1], args[2]);
                    } catch (error) {console.log(error)};
    
                    msg.LocalNumber.find({localNumber: phoneNumber.number})
                            .then(number => {
                                if(number.length == 0) {
                                    const newLocalNumber = new msg.LocalNumber({
                                        number: phoneNumber.number,
                                        countryCode: phoneNumber.country,
                                    });
                    
                                    newLocalNumber.save()
                                        .then(result => {
                                            msg.reply(`Sucessfully added local number:${phoneNumber.number} to the database.`);
                                            
                                        })
                                        .catch(err => {
                                            msg.reply('There was an error adding the local number to the Database.');
                                            console.log(err)});
                                } else {
                                    msg.reply('Local number already exists.');
    
                                }
    
                        
                            })
                            .catch(error => console.log(error));  
                }
            } 
        } else {
            msg.LocalNumber.find()
            .then(number => {
                msg.channel.send(' | Location Code | Phone Number |');
                number.forEach(localNumber => {
                    msg.channel.send(` | ${localNumber.countryCode} | ${localNumber.number} |`);
                });
                //msg.channel.send(message);                     
            })
            .catch(error => console.log(error));
        }


    },
};