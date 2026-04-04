const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Slap a user')
        .addUserOption(opt => opt.setName('user').setDescription('The user to slap').setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setDescription(`🖐️ **${interaction.user.username}** slapped **${user.username}**! Ouch!`);
        await interaction.reply({ embeds: [embed] });
    },
};
