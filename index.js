require('dotenv').config();
const { Client, GatewayIntentBits, Collection, WebhookClient, EmbedBuilder } = require('discord.js');
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

    await client.login(process.env.DISCORD_TOKEN);

    // Update Webhook Announcement
    const webhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1490028594380931205/aOA5y3SvUWhbjkq1AIE2zgG9L3NyZdnCJqYu-vtjitDcjnrNbfDCnakpaEaui2Kk9q__' });
    const updateEmbed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('🚀 VlaamsCore Update System')
        .setDescription('**Status:** Bot is successfully online and updated.\n\nAll commands and events are currently synchronized with the latest GitHub build.')
        .setTimestamp()
        .setFooter({ text: 'VlaamsCore • Powered by High-End Technology' });

    webhook.send({
        username: 'VlaamsCore Updates',
        avatarURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
        embeds: [updateEmbed],
    }).catch(console.error);
})();
