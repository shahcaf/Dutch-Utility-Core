const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set the slowmode for the channel')
        .addIntegerOption(opt => opt.setName('seconds').setDescription('Seconds (0-21600)').setRequired(true).setMinValue(0).setMaxValue(21600))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const seconds = interaction.options.getInteger('seconds');
        await interaction.channel.setRateLimitPerUser(seconds);
        await interaction.reply(`⌛ **Slowmode** set to **${seconds}** seconds.`);
    },
};
