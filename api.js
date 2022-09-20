const path = require('node:path');
const fetch = require('node-fetch');

exports.get_twitch_token = async function(client_id, secret) {
    const theUrl = `https://id.twitch.tv/oauth2/token?grant_type=client_credentials`;

    const params = new URLSearchParams()
    params.append('client_id', client_id);
    params.append('client_secret', secret);
    params.append('redirect_uri', 'localhost');

    const response = await fetch(theUrl, {
        method: 'POST',
        body: params
    });

    const data = await response.json();
    return data.access_token;
};

exports.is_streamer_live = async function(username, client_id, token) {
    const theUrl = `https://api.twitch.tv/helix/streams?user_login=${username}`
    const headers = {
        "Client-Id": client_id,
        "Authorization": "Bearer " + token
    };

    const response = await fetch(theUrl, { headers: headers });
    const data = await response.json();

    let stream = data?.data?.filter(s => s.user_login === username.toLocaleLowerCase());
    let stream_live = stream && stream.length != 0;

    return {
        live: stream_live,
        ...(stream_live && { stream: stream[0] })
    }
}

exports.get_twitch_user = async function(user_id, client_id, token) {
    const theUrl = `https://api.twitch.tv/helix/users?id=${user_id}`
    const headers = {
        "Client-Id": client_id,
        "Authorization": "Bearer " + token
    };

    const response = await fetch(theUrl, { headers: headers });
    const data = await response.json();

    let user = data?.data?.filter(u => u.id === user_id);
    let user_found = user && user.length != 0;

    return {
        success: user_found,
        ...(user_found && { user: user[0] })
    }
}

exports.get_twitch_game = async function(game_id, client_id, token) {
    const theUrl = `https://api.twitch.tv/helix/games?id=${game_id}`
    const headers = {
        "Client-Id": client_id,
        "Authorization": "Bearer " + token
    };

    const response = await fetch(theUrl, { headers: headers });
    const data = await response.json();

    let game = data?.data?.filter(s => s.id === game_id);
    let game_exists = game && game.length == 1

    return {
        success: game_exists,
        ...(game_exists && { game: game[0] })
    }
}

exports.get_config = function() {
    const fileName = path.join(__dirname, 'config.json');
    const file = require(fileName);

    return file;
}

exports.format_ping = function(role) {
    return role == "" ? "" : (role == "@everyone" ? "@everyone" : `<@&${role}>`)
}

exports.format_date = function() {
    var d = new Date();
    return `${d.getFullYear() + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2)}`;
}

exports.format_alert = function(type, message) {
    if(type == 'danger') {
        return `
        \`\`\`ansi
[2;31m❌ ${message}[0m\`\`\`
        `;
    }
    else if(type == 'warning') {
        return `
        \`\`\`ansi
[2;31m[2;33m⚠️ ${message}[0m[2;31m[0m\`\`\`
        `;
    }
    else if(type == 'success') {
        return `
        \`\`\`ansi
[2;31m[2;33m[2;32m✅ ${message}[0m[2;33m[0m[2;31m[0m\`\`\`
        `;
    }
}