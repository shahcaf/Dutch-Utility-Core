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
    
    // Render Free Tier Keep-Alive
    setInterval(() => {
        const https = require('https');
        const url = process.env.RENDER_EXTERNAL_URL;
        if (url) {
            https.get(url, (res) => {
                console.log(`[KeepAlive] Ping received - Status ${res.statusCode}`);
            }).on('error', (err) => {
                console.error(`[KeepAlive] Error:`, err.message);
            });
        }
    }, 840000); // 14 minutes (Render spins down after 15)
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

    // Update Webhook System
    const webhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1490028594380931205/aOA5y3SvUWhbjkq1AIE2zgG9L3NyZdnCJqYu-vtjitDcjnrNbfDCnakpaEaui2Kk9q__' });
    
    const sendUpdate = () => {
        const updateEmbed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('🚀 VlaamsCore Status Report')
            .setDescription('**Status:** Bot remains online and fully operational.\n\nAll systems are currently optimized and healthy.')
            .setTimestamp()
            .setFooter({ text: 'VlaamsCore • Powered by High-End Technology' });

        webhook.send({
            username: 'VlaamsCore Updates',
            avatarURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
            embeds: [updateEmbed],
        }).catch(console.error);
    };

    // Initial send
    sendUpdate();

    // Set hourly loop (3600000ms = 1 hour)
    setInterval(sendUpdate, 3600000);
})();
