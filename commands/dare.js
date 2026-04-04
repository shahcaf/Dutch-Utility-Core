const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dare')
        .setDescription('Get a random dare'),

    async execute(interaction) {
        const dares = [
            'Do 10 pushups.', 'Sing a song for 30 seconds.', 'Post a random photo from your camera roll.',
            'Type with your eyes closed for the next 2 minutes.', 'Talk with a different accent for 1 minute.',
            'Let someone else send a message using your account.'
        ];
        const res = dares[Math.floor(Math.random() * dares.length)];
        await interaction.reply(`🔥 **Dare:** ${res}`);
    },
};
