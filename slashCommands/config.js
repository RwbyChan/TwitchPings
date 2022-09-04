const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const api = require('../api');

const fs = require('node:fs');
const path = require('node:path');

const fileName = path.join(__dirname, '..', 'config.json');
const file = require(fileName);

function getConfigFormatted() {

    const embed = new EmbedBuilder()
        .setTitle('Your current configuration:')
        .addFields(
            { name: 'Twitch name', value: file.twitch_channel_name || '-' },
            { name: 'Embed color', value: file.discord_embed_color || '-' },
            { name: 'Embed footer message', value: file.discord_embed_footer_message || '-' },
            { name: 'Discord channel', value: `<#${file.discord_channel_id}>` || '-' },
            { name: 'Role to ping', value: file.discord_ping_role == '' ? '-' : ('@everyone' ? '@everyone' : `<@&${file.discord_ping_role}>`) || '-' },
            { name: 'Auto crosspost', value: file.auto_crosspost ? 'True' : 'False' || '-' },
        )
        .setFooter({ text: 'You can change these by using /config'});
    
    return embed;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Shows or sets the configuration')
        .addStringOption(option =>
            option.setName('twitch_name')
            .setDescription('Sets the Twitch name for the announcements.')
        )
        .addStringOption(option =>
            option.setName('embed_color')
            .setDescription('The color of the embed.')
        )
        .addStringOption(option =>
            option.setName('embed_footer_message')
            .setDescription('The footer message for the embed.')
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('The channel to send the message to.')
        )
        .addRoleOption(option =>
            option.setName('role')
            .setDescription('The role to be pinged.')
        )
        .addBooleanOption(option => 
            option.setName('auto_crosspost')
            .setDescription('Auto publish the message in an announcement channel to all channels following it.')
        ),
    async execute(client, interaction) {
        let config = api.get_config();
        let args = interaction.options;

        if(args.data.length == 0) {
            return await interaction.reply({
                embeds: [getConfigFormatted()],
                ephemeral: true
            });
        }
        
        // Get properties from interaction
        let twitch_name = args.getString('twitch_name');
        let embed_color = args.getString('embed_color');
        let embed_footer_message = args.getString('embed_footer_message');
        let channel = args.getChannel('channel');
        let role = args.getRole('role');
        let auto_crosspost = args.getBoolean('auto_crosspost');

        // Set properties
        config.twitch_channel_name = twitch_name || config.twitch_channel_name;
        config.discord_channel_id = channel ? channel.id : config.discord_channel_id;
        config.discord_ping_role = role ? (role?.tags?.botId == client.user.id ? '' : (role.name == '@everyone' ? '@everyone' : role.id)) : config.discord_ping_role;
        config.discord_embed_color = embed_color || config.discord_embed_color;
        config.discord_embed_footer_message = embed_footer_message || config.discord_embed_footer_message;
        config.auto_crosspost = auto_crosspost || config.auto_crosspost;

        fs.writeFile(fileName, JSON.stringify(file, null, 4), function writeJSON(err) {
            if (err) return console.log(err);
        });

        await interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription(api.format_alert('success', 'Successfully updated your configuration!')),
                getConfigFormatted()],
            ephemeral: true
        });
    }
};