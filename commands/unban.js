const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user by ID')
        .addStringOption(option => option.setName('id').setDescription('The Discord ID of the user').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const userId = interaction.options.getString('id');
        
        try {
            await interaction.guild.members.unban(userId);
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('🔓 User Unbanned')
                .addFields(
                    { name: 'User ID', value: userId, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true }
                )
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: '❌ Failed to unban user. Check if the ID is valid.', ephemeral: true });
        }
    },
};
