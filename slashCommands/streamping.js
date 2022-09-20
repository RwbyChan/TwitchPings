const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const api = require('../api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('streamping')
        .setDescription('Sends a stream announcement')
        .addStringOption(option => 
            option.setName('message')
            .setDescription('An extra message to be send before the embed.')    
        )
        .addChannelOption(option =>
            option.setName('discord_channel')
            .setDescription('Send it to another channel than the one configured.')
        )
        .addStringOption(option => 
            option.setName('twitch_username')
            .setDescription('Send a stream announcement for a different Twitch user.')
        )
        .addBooleanOption(option => 
            option.setName('enable_mention')
            .setDescription('Whether or not to ping the configured role.')
        ),
    async execute(client, interaction) {
        const config = api.get_config();
        let message = interaction.options.getString('message');
        let channel = interaction.options.getChannel('discord_channel');
        let user = interaction.options.getString('twitch_username');
        let ping = interaction.options.getBoolean('enable_mention');

        // Get channel property
        if(!channel && !config.discord_channel_id) {
            return await interaction.reply({
                embeds: [new EmbedBuilder().setDescription(api.format_alert('danger', 'You need to provide a Discord channel!'))],
                ephemeral: true
            });
        }
        channel = channel ? channel.id : config.discord_channel_id;

        // Get user property
        if(!user && !config.twitch_channel_name) {
            return await interaction.reply({
                embeds: [new EmbedBuilder().setDescription(api.format_alert('danger', 'You need to provide a Twitch channel name!'))],
                ephemeral: true
            });
        }
        user = {
            display_name: user || config.twitch_channel_name,
            broadcaster_type: '',
            avatar: 'https://i.imgur.com/yXryR0G.png'
        }

        // Get Twitch stream data
        api.get_twitch_token(config.twitch_client_id, config.twitch_client_secret).then(async (token) => {

            // Check if streamer is live
            await api.is_streamer_live(user.display_name, config.twitch_client_id, token).then(async (streamer) => {
                if(streamer.live) {

                    await api.get_twitch_user(streamer.stream.user_id, config.twitch_client_id, token).then(async (u) => {
                        if(u.success) {
                            user = {
                                display_name: u.user.display_name,
                                broadcaster_type: u.user.broadcaster_type,
                                avatar: u.user.profile_image_url
                            }
                        }

                        await api.get_twitch_game(streamer.stream.game_id, config.twitch_client_id, token).then(async (game) => {
                            streamer.game = game.success ? game.game : false;
                                
                            const embed = new EmbedBuilder()
                            .setAuthor({ name: `${user.display_name} is now live on Twitch!`, iconURL: user.avatar })
                            .setTitle(streamer.stream.title || '-')
                            .setURL(`https://twitch.tv/${config.twitch_channel_name}`)
                            .setThumbnail(streamer?.game ? streamer.game.box_art_url.replace('{width}', '285').replace('{height}', '380') + '&t=' + new Date().getTime() : 'https://i.imgur.com/mFjeKgU.jpg')
                            .setImage(streamer?.stream?.thumbnail_url ? streamer.stream.thumbnail_url.replace('{width}', '1920').replace('{height}', '1080') + '&t=' + new Date().getTime() : 'https://i.imgur.com/IXlBnkE.jpg')
                            .addFields({ name: 'Playing', value: streamer?.game ? streamer.game.name : '-' })
                            .setFooter({ text: `${api.format_date()} ${config.discord_embed_footer_message}` })
                            .setColor(config.discord_embed_color || "#9146FF");

                            client.channels.fetch(channel).then(channel => {
                                channel.send({
                                    content: (ping === null ? api.format_ping(config.discord_ping_role) : (ping === true ? api.format_ping(config.discord_ping_role) : '')) + ' ' + (message != null ? message : ''),
                                    embeds: [embed]
                                }).then(async message => {
                                    if(config.auto_crosspost && message.channel.type == ChannelType.GuildNews) {
                                        message.crosspost()
                                    }

                                    let embeds = [new EmbedBuilder().setDescription(api.format_alert('success', 'Announcement made successfully!'))];
                                    if(config.auto_crosspost && message.channel.type != ChannelType.GuildNews) {
                                        embeds.push(new EmbedBuilder().setDescription(api.format_alert('warning', 'Auto crosspost failed because the channel is not an announcement channel!')))
                                    }
                                    await interaction.reply({
                                        embeds: embeds,
                                        ephemeral: true
                                    });
                                });
                            });
                        });
                    });
                }
                else {
                    await interaction.reply({
                        embeds: [new EmbedBuilder().setDescription(api.format_alert('danger', 'Streamer is not live, try again later!'))],
                        ephemeral: true
                    });
                }
            });
        });
    }
};