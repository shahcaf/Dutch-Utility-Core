const { Events } = require('discord.js');

global.spamMap = global.spamMap || new Map();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        // Anti-Spam Logic
        if (global.antispam?.get(message.guildId)) {
            const now = Date.now();
            const userSpam = global.spamMap.get(message.author.id) || { count: 0, last: now };
            
            if (now - userSpam.last < 3000) { // 3 second window
                userSpam.count++;
            } else {
                userSpam.count = 1;
            }
            userSpam.last = now;
            global.spamMap.set(message.author.id, userSpam);

            if (userSpam.count > 5) { // Max 5 messages in 3 seconds
                await message.delete().catch(() => {});
                return;
            }
        }

        const data = global.countingChannels?.get(message.guildId);
        if (!data || message.channel.id !== data.channelId) return;

        const number = parseInt(message.content);
        if (isNaN(number)) {
             return message.delete().catch(() => {});
        }

        const nextNumber = data.currentNumber + 1;

        if (number === nextNumber) {
            if (message.author.id === data.lastUser) {
                message.delete().catch(() => {});
                // Optional: We don't reset the count for double-counts unless you want to, 
                // but usually it just deletes. I'll reset to be safe if that's what's expected for 'fail'.
                data.currentNumber = 0;
                data.lastUser = null;
                return;
            }

            data.currentNumber = nextNumber;
            data.lastUser = message.author.id;
            message.react('✅').catch(() => {});
        } else {
            message.delete().catch(() => {});
            data.currentNumber = 0;
            data.lastUser = null;
        }
    },
};
