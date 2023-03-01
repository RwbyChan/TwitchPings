const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const api = require('../api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('preview')
        .setDescription('See a preview of the stream announcement'),
    async execute(client, interaction) {
        const config = api.get_config();

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${config.twitch_channel_name} is now live on Twitch!`, iconURL: 'https://i.imgur.com/yXryR0G.png' })
        .setTitle('Checking out this fancy preview!')
        .setURL(`https://twitch.tv/${config.twitch_channel_name}`)
        .setThumbnail('https://i.imgur.com/mFjeKgU.jpg')
        .setImage('https://i.imgur.com/IXlBnkE.jpg')
        .addFields({ name: 'Playing', value: 'Just Chatting' })
        .setFooter({ text: `${api.format_date()} ${config.discord_embed_footer_message}` })
        .setColor(config.discord_embed_color || "#9146FF");

        let button = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Watch stream').setStyle(ButtonStyle.Link).setURL(`https://twitch.tv/${config.twitch_channel_name}`));

        await interaction.reply({
            content: api.format_ping(config.discord_ping_role),
            embeds: [embed],
            components: [button],
            ephemeral: true
        });
    }
};