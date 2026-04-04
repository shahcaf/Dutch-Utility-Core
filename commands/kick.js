const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option => option.setName('user').setDescription('User to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the kick').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        if (!user) return interaction.reply({ content: 'User not found.', ephemeral: true });

        try {
            await user.kick(reason);
            const embed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle('👢 User Kicked')
                .addFields(
                    { name: 'User', value: user.user.tag, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                );
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: '❌ Failed to kick user.', ephemeral: true });
        }
    },
};
