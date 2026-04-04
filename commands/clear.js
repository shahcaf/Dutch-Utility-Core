const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Purge a specified number of messages')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const deleted = await interaction.channel.bulkDelete(amount, true);
        
        const embed = new EmbedBuilder()
            .setColor('#424242')
            .setDescription(`✅ Cleared **${deleted.size}** messages!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
