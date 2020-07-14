const { Message } = require("discord.js");

module.exports = {
    name:'help',
    description:'Lists all available commands',
    execute(msg) {
        const data = [];
        const { commands } = msg.client;

        data.push('Currently available commands: ');
        data.push(commands.map(command => command.name).join(', '));

        return msg.author.send(data, { split: true })
            .then(() => {
                if (msg.channel.type === 'dm') return;
                msg.reply("I've sent you a DM with all of my commands.");
            })
            .catch(error => {
                console.error(`Could not send Dm to ${msg.author.tag}.\n`, error);
                msg.reply("I couldn't send you a DM, did you block me? :(");
            })
    }
}