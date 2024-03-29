# TwitchPings
A Discord bot that allows you to announce your Twitch streams.

⚠️ **Warning:** this bot does NOT automatically send a message when you go live, you'll have to enter a command for it to fetch if you are live allowing you to choose when to ping and how many times. This bot is made to avoid the long wait times for the free alternatives that ping automatically / that ping several times when your stream goes offline for a few seconds.

## How to invite:


## Commands
- **/config:** change your configuration, shows current config when you give no arguments
    - twitch_name: the name of the twitch channel you want to ping
    - embed_color: the color of the embed
    - embed_footer_message: the message that'll show in the footer of the embed
    - discord_channel: which channel the messages needs to be send to
    - discord_role: the Discord role to be pinged (enter the bots unique role to unset it)
        - ⚠️ this unique role only gets added when inviting the bot with permissions set (you can use the invite link from step 6 from 'Usage' section below)
    - auto_crosspost: auto publish the message to all channels following it (only works for announcement channels)
- **/streaming:** sends a message for the channel configured
    - message: (optional) an extra message to be send before the embed
    - discord_channel: (optional) if you want to send it to a channel different from your configuration
    - twitch_username: (optional) if you want to send a message for a twitch user different from the configuration
    - enable_mention: (optional) whether or not you want to ping the configured role
- **/preview**: show a preview of the message that will be send

## Usage:
1. Clone this repository `git clone https://github.com/RwbyChan/TwitchPings.git` or download it
2. Run `npm install` inside the repo folder
3. Copy rename `config_example.json` to `config.json`
4. Enter your data in `config.json`:
    - **discord_bot_token**: your Discord bot token
    - **twitch_client_id**: your Twitch client ID
    - **twitch_client_secret**: your Twitch client secret
    - **twitch_channel_name**: the name of the channel you want to ping for
    - **discord_channel_id**: (optional) the ID of the channel in which the messages will be sent
    - **discord_ping_role**: (optional) the role to be pinged
    - **discord_embed_color**: (optional) the color of the embed (# + hexadecimal)
    - **discord_embed_footer_message**: (optional) message that shows in the footer of the embed, you can also leave this empty
    - **auto_crosspost**: if you want to auto publish the message to all channels following it (only works for announcement channels)
5. Run `npm run start` or `node index.js` to start the bot
6. Invite the bot using https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot&permissions=149504 (replace CLIENT_ID with your bots' client_id)

## How to get Twitch Client ID / secret:
1. Go to the [Twitch Developer console](https://dev.twitch.tv/console) and log in with your account
2. Click to `Register Your Application`
3. Enter a name
4. Set OAuth Redirect URLs to `localhost`
5. Set Category to `Application Integration`
6. Click create