const Discord = require('discord.js');
const client = new Discord.Client();
let dateFormat = require('dateformat');
let Twitch = require('simple-twitch-api');

var CONFIG;
try {
    CONFIG = require('./config.json');
    console.log('Config file loaded!');
} catch (e) {
    console.log(`${e}\n\nError loading config, exiting...`);
    process.exit(0);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

    if(msg.author.id == CONFIG.owner_user_id && msg.content == CONFIG.bot_command) {
        
        Twitch.getToken(CONFIG.twitch_client_id, CONFIG.twitch_client_secret, CONFIG.twitch_scope).then(async result => {

            var stream_data = {}
 
            let access_token = result.access_token;
                
            // GET USER
            let user = await Twitch.getUserInfo(access_token, CONFIG.twitch_client_id , CONFIG.twitch_channel_name);
            if(user.data.length === 0) {
                return msg.channel.send('Failed to fetch user...').then(message => {
                    message.delete({timeout:5000});
                });
            }

            // GET STREAM
            let stream = await Twitch.getStream(access_token, CONFIG.twitch_client_id, user.data[0].id);
            if(stream.data.length === 0) {
                return msg.channel.send('Failed to fetch stream, if you are live, try again later...').then(message => {
                    message.delete({timeout:5000});
                });
            }

            // GET GAME
            let game = await Twitch.getGames(access_token, CONFIG.twitch_client_id, stream.data[0].game_id);
            if(game.data.length === 0) {
                return msg.channel.send('Failed to fetch stream, if you are live, try again later...').then(message => {
                    message.delete({timeout:5000});
                });
            }

            // SET MESSAGE INFO
            stream_data = {
                channel_name: user.data[0].display_name,
                channel_avatar: user.data[0].profile_image_url,
                game_name: game.data[0].name,
                game_art: game.data[0].box_art_url,
                thumbnail: stream.data[0].thumbnail_url.replace('{width}', '1920').replace('{height}', '1080') + '&t=' + new Date().getTime(),
                title: stream.data[0].title,
                date: dateFormat(new Date(), "yyyy/mm/dd")
            };

            // FETCH SPECIFIC CHANNEL
            client.channels.fetch(CONFIG.discord_channel_id).then(channel => {

                 // SEND MESSAGE
                channel.send(CONFIG.discord_ping,
                    new Discord.MessageEmbed()
                    .setAuthor(`${stream_data.channel_name} is now live on Twitch!`, stream_data.channel_avatar)
                    .setTitle(stream_data.title)
                    .setURL(`https://twitch.tv/${stream_data.channel_name}`)
                    .setThumbnail(stream_data.game_art)
                    .setImage(stream_data.thumbnail)
                    .addField('Playing', stream_data.game_name)
                    .setFooter(`${stream_data.date}${CONFIG.discord_embed_footer_message}`)
                    .setColor(CONFIG.discord_embed_color)
                );
            })
            .catch(error => {
                msg.channel.send('Error fetching channel!').then(message => {
                    message.delete({timeout:5000});
                });
                console.log(error);
            });

        }).catch(error => {
            msg.channel.send('Error in fetching data from Twitch!').then(message => {
                message.delete({timeout:5000});
            });
            console.log(error);
        });

        msg.delete();
    }
});

client.login(CONFIG.discord_bot_token);