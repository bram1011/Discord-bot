module.exports = {
    name:"coin",
    description:"flips a coin",
    execute(msg) {
        let coinFlip = Math.floor(Math.random() * 2);
        if (coinFlip == 0) {
            msg.reply("heads!");
        }
        else {
            msg.reply("tails!");
        }
        return;
    }
}