const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const api = require('../api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stream')
        .setDescription('Get details about the livestream'),
    async execute(client, interaction) {

        const embed = new EmbedBuilder()
        .setAuthor({ name: `Test` })

        await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    }
};