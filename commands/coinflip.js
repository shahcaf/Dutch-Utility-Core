const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin'),

    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const embed = new EmbedBuilder()
            .setColor('#F1C40F')
            .setTitle('🪙 Coin Flip')
            .setDescription(`The coin landed on: **${result}**!`);
        await interaction.reply({ embeds: [embed] });
    },
};
