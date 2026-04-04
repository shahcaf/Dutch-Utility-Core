const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user (Mute)')
        .addUserOption(option => option.setName('user').setDescription('User to timeout').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Duration in minutes').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getMember('user');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        if (!user) return interaction.reply({ content: 'User not found.', ephemeral: true });

        try {
            await user.timeout(duration * 60 * 1000, reason);
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('⏳ User Timed Out')
                .addFields(
                    { name: 'User', value: user.user.tag, inline: true },
                    { name: 'Duration', value: `${duration} minutes`, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                );
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: '❌ Failed to timeout user.', ephemeral: true });
        }
    },
};
