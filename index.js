require('dotenv').config();
const { Client, GatewayIntentBits, Collection, WebhookClient, EmbedBuilder } = require('discord.js');
const express = require('express');
const loadCommands = require('./handlers/commands');
const loadEvents = require('./handlers/events');

// Initialize Prisma with a try-catch to keep the bot online even if DB fails
let prisma;
if (process.env.DATABASE_URL) {
    try {
        prisma = require('./database');
        console.log('[Database] Prisma client initialized.');
    } catch (e) {
        console.error('[CRITICAL] Failed to load Prisma client:', e.message);
    }
} else {
    console.warn('[Notice] DATABASE_URL is missing. Bot will run in simulation mode.');
}

// Express server for Render Port Binding
const app = express();
const PORT = process.env.PORT || 10000; // Use 10000 by default for Render

app.get('/', (req, res) => {
    res.status(200).send({ status: 'online', name: 'VlaamsCore', uptime: process.uptime() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HTTP] Web server listening on port ${PORT}`);
    
    // Render Free Tier Keep-Alive
    const url = process.env.RENDER_EXTERNAL_URL;
    if (url) {
        console.log(`[KeepAlive] System activated. Target: ${url}`);
        setInterval(() => {
            const https = require('https');
            https.get(url, (res) => {
                console.log(`[KeepAlive] Ping successful - Status ${res.statusCode}`);
            }).on('error', (err) => {
                console.error(`[KeepAlive] Error:`, err.message);
            });
        }, 840000); // 14 mins
    } else {
        console.warn('[Notice] RENDER_EXTERNAL_URL missing. Auto-ping disabled.');
    }
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
client.prisma = prisma; // Attach to client for access in commands/events

(async () => {
    try {
        console.log('[Bot] Initializing handlers...');
        await loadCommands(client);
        await loadEvents(client);
        
        client.on('error', error => console.error('[Bot Error]', error));
        process.on('unhandledRejection', error => console.error('[Unhandled Rejection]', error));

        if (!process.env.DISCORD_TOKEN) {
            console.error('\n[CRITICAL ERROR] DISCORD_TOKEN is missing!');
            process.exit(1);
        }
        
        console.log('[Bot] Logging in...');
        await client.login(process.env.DISCORD_TOKEN);
        console.log(`[Bot] Successfully logged in to Discord.`);

        // Webhook System (Optional Status Reporting)
        const updateWebhookUrl = process.env.STATUS_WEBHOOK_URL || 'https://discord.com/api/webhooks/1490028594380931205/aOA5y3SvUWhbjkq1AIE2zgG9L3NyZdnCJqYu-vtjitDcjnrNbfDCnakpaEaui2Kk9q__';
        const webhook = new WebhookClient({ url: updateWebhookUrl });
        
        const sendUpdate = () => {
            const updateEmbed = new EmbedBuilder()
                .setColor('#2ecc71')
                .setTitle('🚀 VlaamsCore Status Report')
                .setDescription('**Status:** All systems are green.\n\nDatabase: ' + (prisma ? 'Connected' : 'Simulation Mode'))
                .setTimestamp()
                .setFooter({ text: 'VlaamsCore • Powered by High-End Technology' });

            webhook.send({
                username: 'VlaamsCore Updates',
                avatarURL: client.user.displayAvatarURL(),
                embeds: [updateEmbed],
            }).catch(e => console.error('[Webhook Error]', e.message));
        };

        sendUpdate();
        setInterval(sendUpdate, 3600000); // Hourly

    } catch (err) {
        console.error('[Initialization Error]', err);
    }
})();

