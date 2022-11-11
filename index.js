const { Client, GatewayIntentBits, Routes, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { discord_bot_token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const slashCommands = [];
const globalCommands = [];

// When the client is ready, run this code (only once)
client.once('ready', () => {
	let client_id = client.application.id;
    let guild_id = client.guilds.cache.first().id;

	console.log(`${client.user.username} is online.`);   

	// Register Slash commands
    const rest = new REST({ version: 10 }).setToken(discord_bot_token);
	
	// Guild Commands
	rest.put(Routes.applicationGuildCommands(client_id, guild_id), { body: slashCommands })
		.then(data => console.log(`Successfully registered ${data.length} guild commands.`))
		.catch(console.error);

	// Global Commands
	rest.put(Routes.applicationCommands(client_id), { body: globalCommands })
		.then(data => console.log(`Successfully registered ${data.length} global commands.`))
		.catch(console.error);
});

const commandsPath = path.join(__dirname, "slashCommands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
    slashCommands.push(command.data.toJSON());
}

const globalCommandsPath = path.join(__dirname, "globalCommands");
const globalCommandFiles = fs.readdirSync(globalCommandsPath).filter(file => file.endsWith('.js'));

for (const file of globalCommandFiles) {
	const filePath = path.join(globalCommandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
    globalCommands.push(command.data.toJSON());
}

// On slash command event
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(client, interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(discord_bot_token);