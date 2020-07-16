

module.exports = {
    name:'poll',
    description:'Initiates a poll',
    execute(msg) {
        msg.reply("please send a message with the options you want the poll to have seperated with commas");

        const filter = newMsg => (newMsg.member.id == msg.member.id) && (!newMsg.mentions.has(process.env.BOTID));
        const collector = msg.channel.createMessageCollector(filter, {time: 100000});

        collector.on('collect', newMsg => {
            collector.stop();
            let options = newMsg.content.split(',');
            
            for (let i = 0; i < options.length; i++) {
                msg.channel.send(options[i])
                        .then(botMsg => botMsg.react('👍'));
                
            }
        });
    }
}