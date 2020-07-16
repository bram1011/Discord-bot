const mega = require('megajs');
const fs = require('fs');
const request = require('request');
require('dotenv').config();

var isReady = false;


module.exports = {
    name: 'upload',
    description: 'Uploads an image or video to MEGA',
    execute(msg) {
        msg.reply("please send the image or video you want to upload.");

        const filter = newMsg => (newMsg.member.id == msg.member.id) && (newMsg.attachments.size > 0) && (!newMsg.mentions.has(process.env.BOTID));
        const collector = msg.channel.createMessageCollector(filter, {time: 15000});

        collector.on('collect', newMsg => {

            const storage = mega({email: process.env.EMAIL, password: process.env.PASSWORD});
            storage.on('ready', function() {
                collector.stop();
            
                const attachment = newMsg.attachments.first(1)[0];
                let target = storage.root;

                if (attachment.url.endsWith('.png') || attachment.url.endsWith('.jpg') || attachment.url.endsWith('.jpeg') || attachment.url.endsWith('.gif')) {
                    target = storage.root.children[0];
                    newMsg.reply("image detected, uploading to 'Pics' folder");
                } 
                else if (attachment.url.endsWith('.mov') || attachment.url.endsWith('.mp4') || attachment.url.endsWith('.wmv') || attachment.url.endsWith('.flv') || attachment.url.endsWith('.avi')) {
                    target = storage.root.children[1];
                    newMsg.reply("video detected, uploading to 'Vids' folder.");
                }
                else {
                    newMsg.reply('unknown file type, uploading to root folder.');
                }


                let upload = request(attachment.url).pipe(target.upload(
                    {
                        name:attachment.name,
                        size:attachment.size,
                    }
                ));

                upload.on('finish', () => {
                    newMsg.reply("upload complete!");
                });

                upload.on('error', () => {
                    newMsg.reply('sorry I had an oopsie and could not upload that file');
                })
            });
            

        });

        
    }
}