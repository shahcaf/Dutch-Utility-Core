const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option => option.setName('user').setDescription('User to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the ban').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        try {
            await interaction.guild.members.ban(user, { reason });
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('🔨 User Banned')
                .addFields(
                    { name: 'User', value: user.tag, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: '❌ Failed to ban user. Check permissions.', ephemeral: true });
        }
    },
};
