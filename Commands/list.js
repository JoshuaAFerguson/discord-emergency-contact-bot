async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

module.exports = {
    name: 'list',
    description: 'List users.',
    async execute(msg, args) {
        const member = msg.guild.members.cache.find(user => user.id === msg.author.id)
        const roles = msg.guild.roles.cache.find(role => role.name === 'Phat ASHs');

        if (member._roles.find(id => id === roles.id))
        {
            let message = '```| Username | Code | Local Number | Phone Number |\n';

            let contacts = await msg.Contact.find();


                    await asyncForEach(contacts, async (user) => {

                        const memberList = msg.guild.members.cache.find(member => member.id === user.userID);

                        const result = await msg.LocalNumber.findOne({countryCode: user.countryCode});

                        if (result)
                        {
                            message += `${memberList.nickname ? memberList.nickname : memberList.username} | ${user.countryCode} | ${result.number} | ${user.phoneNumber} |\n`;
                        } else {
                            message += `${memberList.nickname ? memberList.nickname : memberList.username} | ${user.countryCode} | None | ${user.phoneNumber} |\n`;
                        }


                        
                        
                    });

                    //formatTable(message.value);
                    message += '```';
                    msg.channel.send(message)

        } else {
            msg.reply('You do not have the correct permissions to execute that command.');
        }
    },
};