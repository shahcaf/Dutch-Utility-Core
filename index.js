require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');
// const prisma = require('./database'); // Temporarily disabled
const loadCommands = require('./handlers/commands');
const loadEvents = require('./handlers/events');

// Express server for Render Port Binding
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('VlaamsCore is running!');
});

app.listen(PORT, () => {
    console.log(`[HTTP] Web server listening on port ${PORT}`);
});

// Discord Bot Setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
    ],
});

client.commands = new Collection();

(async () => {
    await loadCommands(client);
    await loadEvents(client);
    
    // Auto-reconnect handling (discord.js handles this automatically mostly, but catching errors is good)
    client.on('error', error => {
        console.error('[Bot Error]', error);
    });

    process.on('unhandledRejection', error => {
        console.error('[Unhandled Rejection]', error);
    });

    client.login(process.env.DISCORD_TOKEN);
})();
