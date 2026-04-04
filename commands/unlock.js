const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock the current channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
        
        const embed = new EmbedBuilder()
            .setColor('#2ECC71')
            .setTitle('🔓 Channel Unlocked')
            .setDescription('Conversation has been restored in this channel.')
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    },
};
