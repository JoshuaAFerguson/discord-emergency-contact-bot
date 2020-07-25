const fetch = require('node-fetch');

module.exports = {
    name: 'timer',
    description: 'Set a timer to be called.',
    usage: '<H>h<M>m',
    async execute(msg, args) {
        const time = args[0].split(/(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m?)?/);
        const days = time[1];
        const hours = time[2];
        const minutes = time[3];
  
        const totalTime = parseInt(((days || 0) * 24 * 60 * 60)) + 
                          parseInt(((hours || 0) * 60 * 60)) + 
                          parseInt(((minutes || 0) * 60));

        const ms = parseInt(totalTime * 1000);

        const now = Date.now();
        const endDate = new Date(now + ms);

        const result = await fetch('http://localhost:3000/timer', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dateAdded: now,
                timeout: endDate,
                userID: msg.author.id,
                channelID: msg.channel.id
            })
        });

        const resultData = await result.json();
        //console.log(resultData);
        

        setTimeout(async (id = msg.author.id, channel = msg.channel.id) => {

            const result = await fetch(`http://localhost:3000/contact/${id}`);
            const resultData = await result.json();
        
            //console.log(resultData);
        
            if(resultData.success)
            {
                const call = await fetch(`http://localhost:3000/call/timer`, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        to: resultData.result.phoneNumber,
                        from: process.env.OUTGOING_NUMBER,
                        userID: id,
                        eventTargetID: id,
                        channelID: channel
                    })
                    });
                msg.reply(`Calling ${msg.author}.`);
            } else {
                msg.reply('User does not have a registered phone number!');
            }


        }, ms);
    },
};

async function timeout(msg) {



}