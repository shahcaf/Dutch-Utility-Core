const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('truth')
        .setDescription('Get a random truth question'),

    async execute(interaction) {
        const truths = [
            'What is your biggest fear?', 'Who is your secret crush?', 'What is the most embarrassing thing you have ever done?',
            'What is the biggest lie you have ever told?', 'Have you ever cheated on a test?', 'What is your worst habit?',
            'Who do you think is the best looking person here?'
        ];
        const res = truths[Math.floor(Math.random() * truths.length)];
        await interaction.reply(`🤔 **Truth:** ${res}`);
    },
};
