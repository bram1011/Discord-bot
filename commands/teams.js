const { Collector } = require("discord.js");

module.exports = {
    name: 'teams',
    description: 'splits mentioned users into two teams',
    execute(msg) {
        msg.reply("please mention (@) the people you would like to split into teams");

        const filter = newMsg => newMsg.member.id == msg.member.id;
        const collector = msg.channel.createMessageCollector(filter, {time: 15000});

        collector.on('collect', newMsg => {
            collector.stop();
            newMsg.reply("thanks. Assigning teams.");
            let members = newMsg.mentions.members;
            let numMembers = members.size;
            let membersArray = [];
            let teamOne = [];
            let teamTwo = [];
            let randNum = -1;
            let currMember;

            if (!members) {
                newMsg.reply("remember when I said to mention the people you want split up?");
                
            }

            members.forEach(function(member) {
                // Make sure all members are valid
                if (!member) {
                    newMsg.reply("I didn't recognize one of the people you mentioned.");
                    
                }
                else {
                    membersArray.push(member);
                }
            }); 

            for (let i = 0; i < numMembers; i++) {
                while (!membersArray[randNum]) {
                    randNum = Math.floor(Math.random() * numMembers);
                }

                currMember = membersArray[randNum];
                
                if (teamOne.length > teamTwo.length) {
                    teamTwo.push(currMember.user.username);
                    membersArray.splice(randNum, 1);
                }
                else {
                    teamOne.push(currMember.user.username);
                    membersArray.splice(randNum, 1);
                }
                
            }
            
            newMsg.channel.send("Team 1:");
            if (teamOne.length > 0) {
                newMsg.channel.send(teamOne.toString());
            }
            newMsg.channel.send("Team 2:");
            if (teamTwo.length > 0) {
                newMsg.channel.send(teamTwo.toString());
            }
            else {
                newMsg.reply("well you are gonna have to send me more than one person");
            }
            
        });

        
    }
        
};