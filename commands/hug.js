const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug a user')
        .addUserOption(opt => opt.setName('user').setDescription('The user to hug').setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const embed = new EmbedBuilder()
            .setColor('#FF9FF3')
            .setDescription(`🫂 **${interaction.user.username}** gives **${user.username}** a big warm hug!`);
        await interaction.reply({ embeds: [embed] });
    },
};
