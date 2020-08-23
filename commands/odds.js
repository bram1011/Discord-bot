module.exports = {
    name:'odds',
    description:'plays what are the odds with two users using DMs',
    execute(msg) {

        function getOddsResponse(channel, currFilter) {

            return new Promise(resolve => {
                const oddsCollector = channel.createMessageCollector(currFilter, {time: 30000});

                oddsCollector.on('collect', oddsResponse => {
                    oddsCollector.stop();

                    let userNum = parseInt(oddsResponse.content, 10);

                    if (isNaN(userNum)) {
                        throw new Error('User must provide integer');
                    }
                    else {
                        resolve(userNum);
                    }
                });
            });
        }

        msg.reply('who are you challenging? (make sure you @ them)');

        const filter = newMsg => (newMsg.member.id == msg.member.id) && (!newMsg.mentions.has(process.env.BOTID));
        const collector = msg.channel.createMessageCollector(filter, {time: 30000});

        collector.on('collect', async newMsg => {
            collector.stop();

            let opponent = newMsg.mentions.members.first();
            let challenger = msg.member;
            let oppName = opponent.displayName;
            let challName = challenger.displayName;

            const challFilter = challResponse => challResponse.author.id == challenger.user.id && challResponse.channel.type == 'dm';
            const oppFilter = oppResponse => oppResponse.author.id == opponent.user.id && oppResponse.channel.type == 'dm';

            opponent.send('You have been challenged to \'what are the odds?\' So, what are the odds?')
            // TODO: ERROR CHECKING
                    .then((oppBotMsg) => {
                        // GETTING ODDS FROM OPPONENT
                        getOddsResponse(oppBotMsg.channel, oppFilter).then((odds) => {
                            // GETTING FIRST NUMBER FROM THE CHALLENGER
                            challenger.send(`Odds are out of ${odds}, please send a number between 0 and ${odds}.`).then((challBotMsg) => {
                                getOddsResponse(challBotMsg.channel, challFilter).then((challengerNum) => {
                                    if (challengerNum < 0 || challengerNum > odds) {
                                        challBotMsg.channel.send(`Please make sure you are sending a number between 0 and ${odds}, rerun the command to try again.`);
                                        // TODO: Way to continue from here
                                        return;
                                    }

                                    // GETTING SECOND NUMBER FROM OPPONENT
                                    opponent.send(`Please send a number between 0 and ${odds}`);
                                    getOddsResponse(oppBotMsg.channel, oppFilter).then((opponentNum) => {
                                        if (opponentNum < 0 || opponentNum > odds) {
                                            opponent.send(`Please make sure you are sending a number between 0 and ${odds}, rerun the command to try again.`);
                                            return;
                                            // TODO: Way to continue from here
                                        }
                                        // OUTPUT RESULTS
                                        msg.channel.send(`The odds were out of ${odds}...${challName} VS. ${oppName}`);
                                        msg.channel.send('And the results are......');
                                        setTimeout(() => { 
                                            
                                            if (challengerNum == opponentNum) {
                                                msg.channel.send(`${challName} and ${oppName} both picked ${challengerNum}!`);
                                            }
                                            else {
                                                msg.channel.send(`${challName} picked ${challengerNum} and ${oppName} picked ${opponentNum}`);
                                            }
                                        }, 5000)
                                    })
                                    // Opponent number error
                                    .catch((oppNum) => {
                                        opponent.send('You have to send me a number, please rerun the command to try again.');
                                        return;
                                    });
                                })
                                // Challenger error
                                .catch((challengerNum) => {
                                    challenger.send('You have to send me a number, please rerun the command to try again.');
                                    return;
                                });
                            });
                            
                            
                        })
                        // Opponent odds error
                        .catch((odds) => {
                            opponent.send('You have to send me a number, please rerun the command to try again.');
                            return;
                        });
                    });

                
            });
            
            
    }
}