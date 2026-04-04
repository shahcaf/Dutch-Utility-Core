const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock the current channel')
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for locking'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const reason = interaction.options.getString('reason') || 'No reason provided';
        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
        
        const embed = new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle('🔒 Channel Locked')
            .setDescription(`This channel has been locked.\n**Reason:** ${reason}`)
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    },
};
