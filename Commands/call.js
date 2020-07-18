module.exports = {
    name: 'call',
    description: 'Call user!',
    execute(msg, args) {
        if (msg.mentions.users.size) {
            const taggedUser = msg.mentions.users.first();

            //console.info(taggedUser);

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
                                        msg.channel.send(`Attempting to call: ${taggedUser.username}`);
                                        console.info(`Setting up call to ${contact[0].phoneNumber} using ${local[0].number}`);
                                        msg.TwilioClient.calls.create({
                                                 url: `${msg.ResponseURL}`,
                                                 to: `${contact[0].phoneNumber}`,
                                                 from: `${local[0].number}`
                                            }).then(call => {
                                                console.info("Call Dispatched");
                                                console.log(call)
                                            })
                                            .catch(error => console.log(error));
                                    }
                                    //console.info(msg.TwilioClient.calls);

                                }).catch(error => console.log(error));
                    }
                }).catch(error => console.log(error));




            
        } else {
            msg.reply('Please tag a valid user!');
        }   
    },
};