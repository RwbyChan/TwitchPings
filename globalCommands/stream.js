const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const api = require('../api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stream')
        .setDescription('Get a link to the stream'),
    async execute(client, interaction) {
        const config = api.get_config();

        await interaction.reply({
            content: `https://twitch.tv/${config.twitch_channel_name}`,
            ephemeral: false
        });
    }
};
