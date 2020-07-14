require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

const botID = '731729566107697252';


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
    // Every message sent

    if (msg.mentions.users.has(botID)) {
        // Extract command from message
        let command = msg.content.toLowerCase();
        command = command.substr(23);
        console.log(command);

        if (!client.commands.has(command)) return;

        try {
            client.commands.get(command).execute(msg);
        } catch (error) {
            console.error(error);
            msg.reply('could not execute command');
        }

        return;
    }
})

client.login(process.env.DISCORD_TOKEN)

