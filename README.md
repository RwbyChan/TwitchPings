# TwitchPings
A Discord bot that allows you to announce your Twitch streams.

⚠️ **Warning:** this bot does NOT automatically send a message when you go live, you'll have to enter a command for it to fetch if you are live allowing you to choose when to ping and how many times. This bot is made to avoid the long wait times for the free alternatives that ping automatically / that ping several times when your stream goes offline for a few seconds.

## Usage:
1. Clone this repository `git clone https://github.com/RwbyChan/TwitchPings.git` or download it
2. Run `npm install` inside the repo folder
3. Copy rename `config_example.json` to `config.json`
4. Enter your data in `config.json`:
    - **discord_bot_token**: your Discord bot token
    - **twitch_client_id**: your Twitch client ID
    - **twitch_client_secret**: your Twitch client secret
    - **twitch_scope**: you can leave this empty
    - **twitch_channel_name**: the name of the channel you want to ping for
    - **bot_command**: the command you want to use to send the message
    - **owner_user_id**: the ID of the user that will run this command
    - **discord_channel_id**: the ID of the channel in which the messages will be sent
    - **discord_ping**: any message you want to send before the embed, usually an @everyone ping, you can also leave this empty
    - **discord_embed_color**: the color of the embed (# + hexadecimal)
    - **discord_embed_footer_message**: message that shows in the footer of the embed, you can also leave this empty
5. Run `npm run start` or `node index.js` to start the bot


## TODO:
- Allow multiple users / roles to request a ping
- Auto send to following channels if available
- Updating to the latest Discord.JS version
