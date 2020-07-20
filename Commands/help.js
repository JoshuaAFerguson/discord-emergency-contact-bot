module.exports = {
    name: 'help',
    description: 'Help!',
    execute(msg, args) {
      msg.channel.send('Available Commands: add, call, text, list.');
    },
};